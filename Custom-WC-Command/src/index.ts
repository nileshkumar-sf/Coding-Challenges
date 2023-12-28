#!/usr/bin/env node
import * as fs from 'fs';

function countBytes(content: Buffer): number {
  return content.length;
}

function countLines(content: string): number {
  const lines = content.split('\n');
  return lines.length - 1;
}

function countWords(content: string): number {
  const words = content.trim().split(/\s+/);
  return words.length;
}

function countCharacters(content: string): number {
  return [...content].length;
}

const args = process.argv.slice(2);
const options = args.filter(arg => arg.startsWith('-'));
const filePath = args.find(arg => !arg.startsWith('-'));

if (!filePath) {
  // Read from standard input
  let inputData = Buffer.alloc(0);

  process.stdin.on('data', chunk => {
    inputData = Buffer.concat([inputData, chunk]);
  });

  process.stdin.on('end', () => {
    processData(inputData);
  });
} else {
  // Read from file
  try {
    const fileContent = fs.readFileSync(filePath);
    processData(fileContent);
  } catch (error) {
    console.error(`Error reading the file: ${error.message}`);
    process.exitCode = 1;
  }
}

function processData(content: string | Buffer) {
  if (!options.length) {
    const bytes = countBytes(
      typeof content === 'string'
        ? Buffer.from(content, 'utf-8')
        : content
    );
    const lines = countLines(content.toString('utf-8'));
    const words = countWords(content.toString('utf-8'));

    console.log(`${bytes}\t${lines}\t${words}\t${filePath ?? ''}`);
  } else {
    for (const option of options) {
      switch (option) {
        case '-c':
          console.log(`Number of bytes: ${countBytes(content as Buffer)}`);
          break;
        case '-l':
          console.log(`Number of lines: ${countLines(content.toString('utf-8'))}`);
          break;
        case '-w':
          console.log(`Number of words: ${countWords(content.toString('utf-8'))}`);
          break;
        case '-m':
          console.log(`Number of characters: ${countCharacters(content.toString('utf-8'))}`);
          break;
        default:
          console.error(`Invalid Option: ${option}`);
          console.error('Use -c to count the number of bytes.');
          console.error('Use -l to count the number of lines.');
          console.error('Use -w to count the number of words.');
          console.error('Use -m to count the number of characters.');
          process.exitCode = 1;
      }
    }
  }
}
