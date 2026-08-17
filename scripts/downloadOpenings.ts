import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpeningEntry {
  eco: string;
  name: string;
  pgn: string;
}

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/lichess-org/chess-openings/master/';
const FILES = ['a.tsv', 'b.tsv', 'c.tsv', 'd.tsv', 'e.tsv'];
const OUTPUT_PATH = path.join(__dirname, '../src/data/openings.json');

async function fetchTSV(filename: string): Promise<string> {
  const url = GITHUB_RAW_BASE + filename;
  console.log(`Downloading ${url}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  return await response.text();
}

function parseTSV(content: string): OpeningEntry[] {
  const lines = content.split('\n').filter(line => line.trim());
  const entries: OpeningEntry[] = [];

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 3) {
      const eco = parts[0].trim();
      const name = parts[1].trim();
      const pgn = parts[2].trim();
      
      if (eco && name && pgn) {
        entries.push({ eco, name, pgn });
      }
    }
  }

  return entries;
}

async function main() {
  console.log('Starting openings download...');
  
  const allOpenings: OpeningEntry[] = [];

  for (const file of FILES) {
    try {
      const tsvContent = await fetchTSV(file);
      const entries = parseTSV(tsvContent);
      console.log(`Parsed ${entries.length} openings from ${file}`);
      allOpenings.push(...entries);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      throw error;
    }
  }

  console.log(`Total openings: ${allOpenings.length}`);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allOpenings, null, 2), 'utf-8');
  console.log(`Saved openings to ${OUTPUT_PATH}`);
}

main().catch(console.error);
