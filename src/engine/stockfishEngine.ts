/**
 * Stockfish Engine Interface
 *
 * stockfish-18-lite-single.js uses a special worker bootstrapping mechanism:
 * The worker URL must include a hash fragment in the format:
 *   /stockfish-18-lite-single.js#<wasmRelPath>,worker
 * This tells the script to run in worker mode and locate the WASM binary.
 */

interface StockfishMove {
  move: string;
  evaluationCp: number;
}

// Singleton worker state
let stockfishWorker: Worker | null = null;
let isWorkerReady = false;
let workerInitializing = false;
let readyCallbacks: Array<() => void> = [];

// Serial search queue — only one Stockfish search runs at a time.
// This prevents concurrent getBestMoves calls from cross-contaminating
// each other's results (e.g. analyzeMove and getBotMove racing).
let searchInProgress = false;
let searchQueue: Array<() => void> = [];

function runNextSearch(): void {
  if (searchInProgress || searchQueue.length === 0) return;
  searchInProgress = true;
  const next = searchQueue.shift()!;
  next();
}

/**
 * Initialize Stockfish Web Worker as singleton.
 * stockfish-18-lite-single.js detects the ",worker" hash to boot in worker mode,
 * and uses the preceding hash segment as the WASM file path.
 */
function initializeWorker(): Worker {
  if (stockfishWorker && isWorkerReady) {
    return stockfishWorker;
  }

  if (!stockfishWorker && !workerInitializing) {
    workerInitializing = true;

    try {
      // The script auto-detects it's inside a worker context and locates
      // the WASM by replacing .js → .wasm in self.location.pathname.
      // No hash fragment needed — avoid potential Vite dev-server hash issues.
      stockfishWorker = new Worker('/stockfish-18-lite-single.js');

      stockfishWorker.onmessage = (e: MessageEvent) => {
        const msg: string = e.data;
        if (msg === 'uciok') {
          isWorkerReady = true;
          workerInitializing = false;
          // Flush all pending ready callbacks
          readyCallbacks.forEach((cb) => cb());
          readyCallbacks = [];
        }
      };

      stockfishWorker.onerror = (error) => {
        console.error('Stockfish Worker error:', error);
        isWorkerReady = false;
        workerInitializing = false;
        stockfishWorker = null;
        // Reject all pending waitForWorkerReady promises so they don't hang
        const cbs = readyCallbacks;
        readyCallbacks = [];
        cbs.forEach((cb) => cb()); // resolve with void — callers handle failure via try/catch
      };

      // Kick off UCI handshake
      stockfishWorker.postMessage('uci');
    } catch (error) {
      console.error('Failed to initialize Stockfish Worker:', error);
      workerInitializing = false;
      throw new Error('Stockfish Worker failed to load.');
    }
  }

  return stockfishWorker!;
}

/**
 * Returns a Promise that resolves once the Stockfish worker is ready (uciok received).
 * Times out after 10 seconds to avoid hanging indefinitely on load failure.
 */
function waitForWorkerReady(): Promise<void> {
  if (isWorkerReady) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const onReady = () => {
      clearTimeout(timeout);
      resolve();
    };

    const timeout = setTimeout(() => {
      readyCallbacks = readyCallbacks.filter((cb) => cb !== onReady);
      reject(new Error('Stockfish worker ready timeout (10s). Check console for worker errors.'));
    }, 10000);

    readyCallbacks.push(onReady);
  });
}

/**
 * Parse score from a UCI score string like "score cp 42" or "score mate 3"
 * Returns evaluation in centipawns from White's perspective.
 */
function parseScore(scoreString: string, turn: 'w' | 'b'): number {
  const parts = scoreString.split(' ');
  const scoreType = parts[1]; // 'cp' or 'mate'
  const scoreValue = parseInt(parts[2], 10);

  let cp: number;
  if (scoreType === 'mate') {
    cp = scoreValue > 0 ? 100000 - scoreValue * 100 : -100000 - scoreValue * 100;
  } else {
    cp = scoreValue;
  }

  // UCI score is always from the current side's perspective → normalize to White's perspective
  if (turn === 'b') {
    cp = -cp;
  }

  return cp;
}

/**
 * Get best moves from Stockfish using MultiPV.
 * @param fen - FEN string of the position
 * @param depth - Search depth (1-20)
 * @param multiPv - Number of principal variations to return (1-500)
 * @returns Array of moves with evaluations from White's perspective
 */
export function getBestMoves(
  fen: string,
  depth: number,
  multiPv: number
): Promise<StockfishMove[]> {
  return new Promise<StockfishMove[]>((outerResolve) => {
    // Enqueue this search so it waits for any in-progress search to complete
    const run = async () => {
      let worker: Worker;
      try {
        worker = initializeWorker();
        await waitForWorkerReady();
      } catch {
        searchInProgress = false;
        runNextSearch();
        outerResolve([]);
        return;
      }
      if (!isWorkerReady) {
        searchInProgress = false;
        runNextSearch();
        outerResolve([]);
        return;
      }

      const turn = fen.split(' ')[1] as 'w' | 'b';
      const candidates: Map<number, StockfishMove> = new Map();
      let resolved = false;

      const finish = (result: StockfishMove[]) => {
        if (resolved) return;
        resolved = true;
        worker.removeEventListener('message', handleMessage);
        searchInProgress = false;
        runNextSearch();
        outerResolve(result);
      };

      // Safety timeout
      const timeout = setTimeout(() => finish([]), 15000);

      const handleMessage = (e: MessageEvent) => {
        if (resolved) return;
        const line: string = e.data;

        if (line.startsWith('info') && line.includes('multipv') && line.includes(' pv ')) {
          const multipvMatch = line.match(/multipv (\d+)/);
          const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
          const pvMatch = line.match(/ pv (\S+)/);

          if (multipvMatch && scoreMatch && pvMatch) {
            const pvIndex = parseInt(multipvMatch[1], 10);
            const evaluationCp = parseScore(scoreMatch[0], turn);
            candidates.set(pvIndex, { move: pvMatch[1], evaluationCp });
          }
        }

        if (line.startsWith('bestmove')) {
          clearTimeout(timeout);
          const result: StockfishMove[] = [];
          for (let i = 1; i <= multiPv; i++) {
            const c = candidates.get(i);
            if (c) result.push(c);
          }
          if (result.length === 0) {
            const bm = line.split(' ')[1];
            if (bm && bm !== '(none)') result.push({ move: bm, evaluationCp: 0 });
          }
          finish(result);
        }
      };

      worker.addEventListener('message', handleMessage);
      worker.postMessage(`setoption name MultiPV value ${multiPv}`);
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go depth ${depth}`);
    };

    searchQueue.push(run);
    runNextSearch();
  });
}

