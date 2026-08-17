import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PuzzleRow {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Rating: string;
  RatingDeviation: string;
  Popularity: string;
  NbPlays: string;
  Themes: string;
  GameUrl: string;
  OpeningTags: string;
  DailyDate: string;
}

interface PuzzleEntry {
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
}

const INPUT_CSV = path.join(__dirname, 'temp/puzzles-raw.csv');
const OUTPUT_PATH = path.join(__dirname, '../src/data/puzzles.json');
const TARGET_COUNT = 7000;

// Rating ranges for stratified sampling
const RATING_RANGES = [
  { min: 0, max: 1200, target: 1500 },    // Easy
  { min: 1200, max: 1600, target: 2500 }, // Medium
  { min: 1600, max: 2000, target: 2000 }, // Hard
  { min: 2000, max: 3000, target: 1000 }, // Expert
];

// Common tactical themes to ensure diversity
const COMMON_THEMES = [
  'fork', 'pin', 'skewer', 'mate', 'promotion', 
  'doubleAttack', 'discoveredAttack', 'sacrifice',
  'deflection', 'interference', 'overloading', 'xray'
];

async function processPuzzles(): Promise<void> {
  console.log('Starting puzzles processing...');
  
  if (!fs.existsSync(INPUT_CSV)) {
    throw new Error(`Input file not found: ${INPUT_CSV}. Please download and extract lichess_db_puzzle.csv.zst to this location.`);
  }

  // Buckets for stratified sampling
  const buckets: Map<string, PuzzleEntry[]> = new Map();
  
  // Initialize buckets for each rating range
  RATING_RANGES.forEach((range, index) => {
    buckets.set(`range_${index}`, []);
  });

  let totalProcessed = 0;
  let totalSelected = 0;

  return new Promise((resolve, reject) => {
    createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row: PuzzleRow) => {
        totalProcessed++;
        
        const rating = parseInt(row.Rating, 10);
        if (isNaN(rating)) return;

        // Find appropriate rating range
        const rangeIndex = RATING_RANGES.findIndex(
          range => rating >= range.min && rating < range.max
        );
        
        if (rangeIndex === -1) return;

        const bucketKey = `range_${rangeIndex}`;
        const bucket = buckets.get(bucketKey)!;
        const target = RATING_RANGES[rangeIndex].target;

        // If bucket not full, add puzzle
        if (bucket.length < target) {
          const themes = row.Themes.split(' ').filter(t => t.trim());
          
          const puzzle: PuzzleEntry = {
            fen: row.FEN,
            moves: row.Moves.split(' '),
            rating: rating,
            themes: themes,
          };
          
          bucket.push(puzzle);
          totalSelected++;
        }

        // Progress logging
        if (totalProcessed % 100000 === 0) {
          console.log(`Processed ${totalProcessed} rows, selected ${totalSelected} puzzles...`);
        }
      })
      .on('end', () => {
        console.log(`Finished processing. Total rows: ${totalProcessed}, Selected: ${totalSelected}`);
        
        // Combine all buckets
        const finalPuzzles: PuzzleEntry[] = [];
        buckets.forEach((bucket, key) => {
          console.log(`${key}: ${bucket.length} puzzles`);
          finalPuzzles.push(...bucket);
        });

        // Shuffle within each rating range for variety
        for (let i = 0; i < finalPuzzles.length; i++) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalPuzzles[i], finalPuzzles[j]] = [finalPuzzles[j], finalPuzzles[i]];
        }

        // Ensure output directory exists
        const outputDir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write JSON file
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalPuzzles, null, 2), 'utf-8');
        console.log(`Saved ${finalPuzzles.length} puzzles to ${OUTPUT_PATH}`);
        
        resolve();
      })
      .on('error', (error) => {
        console.error('Error processing CSV:', error);
        reject(error);
      });
  });
}

processPuzzles().catch(console.error);
