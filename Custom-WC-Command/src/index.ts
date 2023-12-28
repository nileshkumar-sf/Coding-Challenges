#!/usr/bin/env node
import * as fs from 'fs';

function countBytes(content: string): number {
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
  let inputData = '';
  process.stdin.on('data', chunk => {
    inputData += chunk;
  });

  process.stdin.on('end', () => {
    processData(inputData);
  });
} else {
  // Read from file
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    processData(fileContent);
  } catch (error) {
    console.error(`Error reading the file: ${error.message}`);
    process.exitCode = 1;
  }
}

function processData(content: string) {
  if (!options.length) {
    console.log(`${countCharacters(content)}\t${countLines(content)}\t${countWords(content)}\t${filePath ?? ''}`);
  } else {
    for (const option of options) {
      switch (option) {
        case '-c':
          console.log(`Number of bytes: ${countBytes(content)}`);
          break;
        case '-l':
          console.log(`Number of lines: ${countLines(content)}`);
          break;
        case '-w':
          console.log(`Number of words: ${countWords(content)}`);
          break;
        case '-m':
          console.log(`Number of characters: ${countCharacters(content)}`);
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
