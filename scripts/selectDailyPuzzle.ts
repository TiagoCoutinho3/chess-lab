import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Puzzle {
  id?: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
}

interface DailyPuzzleEntry {
  date: string;
  puzzle: Puzzle;
}

interface DailyPuzzleData {
  current: DailyPuzzleEntry;
  history: DailyPuzzleEntry[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUZZLES_PATH = path.join(__dirname, '../src/data/puzzles.json');
const DAILY_PUZZLE_PATH = path.join(__dirname, '../src/data/dailyPuzzle.json');
const RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

function getPuzzleId(puzzle: Puzzle): string {
  return puzzle.id ?? `${puzzle.fen}|${puzzle.moves.join(' ')}`;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function selectDailyPuzzle(): void {
  const puzzles = readJson<Puzzle[]>(PUZZLES_PATH);
  const today = getToday();
  const todayTime = Date.parse(`${today}T00:00:00Z`);
  const previous = fs.existsSync(DAILY_PUZZLE_PATH)
    ? readJson<DailyPuzzleData>(DAILY_PUZZLE_PATH)
    : { current: undefined, history: [] };

  const history = previous.history.filter((entry) => {
    const age = todayTime - Date.parse(`${entry.date}T00:00:00Z`);
    return age >= 0 && age < RETENTION_DAYS * DAY_MS;
  });
  const existingToday = history.find((entry) => entry.date === today);

  if (existingToday) {
    writeDailyPuzzle({ current: existingToday, history });
    return;
  }

  const usedIds = new Set(history.map((entry) => getPuzzleId(entry.puzzle)));
  const candidates = puzzles
    .filter((puzzle) => !usedIds.has(getPuzzleId(puzzle)))
    .sort((left, right) => {
      const moveDifference = right.moves.length - left.moves.length;
      if (moveDifference !== 0) return moveDifference;
      const ratingDifference = right.rating - left.rating;
      if (ratingDifference !== 0) return ratingDifference;
      return getPuzzleId(left).localeCompare(getPuzzleId(right));
    });

  const puzzle = candidates[0];
  if (!puzzle) {
    throw new Error('No unused puzzle is available for the 30-day retention window.');
  }

  const current = { date: today, puzzle };
  writeDailyPuzzle({ current, history: [current, ...history] });
  console.log(`Selected daily puzzle ${getPuzzleId(puzzle)} for ${today}.`);
}

function writeDailyPuzzle(data: DailyPuzzleData): void {
  fs.writeFileSync(DAILY_PUZZLE_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

selectDailyPuzzle();