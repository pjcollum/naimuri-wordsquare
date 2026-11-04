// Word Square

const fs = require("fs");
const path = require("path");

// Count each letter, e.g. "need" -> { n: 1, e: 2, d: 1 }
function countLetters(text) {
  const counts = {};
  for (const letter of text) {
    counts[letter] = (counts[letter] || 0) + 1;
  }
  return counts;
}

// The letters we have left to use
class LetterPool {
  constructor(letters) {
    this.counts = countLetters(letters);
  }

  // Do we have enough letters to make this word?
  canMake(word) {
    const needed = countLetters(word);
    for (const letter in needed) {
      if ((this.counts[letter] || 0) < needed[letter]) return false;
    }
    return true;
  }

  // Remove a word's letters from the pool.
  useLetters(word, row) {
    this.change(word, row, -1);
  }

  // Put a word's letters back (when we backtrack)
  returnLetters(word, row) {
    this.change(word, row, 1);
  }

  // Shared by useLetters and returnLetters: -1 removes, +1 puts back
  change(word, row, direction) {
    for (let i = row; i < word.length; i++) {
      const uses = i === row ? 1 : 2;
      this.counts[word[i]] = (this.counts[word[i]] || 0) + direction * uses;
    }
  }

  // False if any letter has gone below 0
  hasEnough() {
    return Object.values(this.counts).every((count) => count >= 0);
  }

  // True when every letter is used up
  isEmpty() {
    return Object.values(this.counts).every((count) => count === 0);
  }
}

// The square is just a list of words, one per row
class WordSquare {
  constructor(rows = []) {
    this.rows = rows;
  }

  // Read down a column
  column(k) {
    return this.rows.map((row) => row[k]).join("");
  }

  // The letters the next row must start with
  nextPrefix() {
    return this.column(this.rows.length);
  }

  // Check each row matches its column
  isValid() {
    return this.rows.every((row, k) => row === this.column(k));
  }

  toString() {
    return this.rows.join("\n");
  }
}

// The list of allowed words
class Dictionary {
  constructor(words) {
    this.words = words;
  }

  // Load words from a file, one per line
  static fromFile(file) {
    const words = fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word !== "");
    return new Dictionary(words);
  }

  // Keep only words of the right length that we have the letters for
  filter(size, pool) {
    const words = this.words.filter((word) => word.length === size && pool.canMake(word));
    return new Dictionary(words);
  }

  // Words that start with the given letters
  startingWith(prefix) {
    return this.words.filter((word) => word.startsWith(prefix));
  }
}

// Finds the square using backtracking
class WordSquareSolver {
  constructor(dictionary) {
    this.dictionary = dictionary;
  }

  solve(size, letters) {
    if (letters.length !== size * size) {
      throw new Error(`Expected ${size * size} letters, got ${letters.length}`);
    }
    this.size = size;
    this.pool = new LetterPool(letters);
    this.words = this.dictionary.filter(size, this.pool);
    return this.search(new WordSquare());
  }

  // Fill one row at a time. Returns null if stuck, so the row above tries its next word
  search(square) {
    const row = square.rows.length;

    // All rows filled - done if every letter was used
    if (row === this.size) {
      return this.pool.isEmpty() ? square : null;
    }

    for (const word of this.words.startingWith(square.nextPrefix())) {
      this.pool.useLetters(word, row);

      if (this.pool.hasEnough()) {
        const result = this.search(new WordSquare([...square.rows, word]));
        if (result) return result;
      }

      // Dead end - put letters back and try the next word
      this.pool.returnLetters(word, row);
    }

    return null;
  }
}

// Only runs from the command line
if (require.main === module) {
  const size = Number(process.argv[2]);
  const letters = (process.argv[3] || "").toLowerCase();

  if (!Number.isInteger(size) || size < 1 || !letters) {
    console.log("Usage: node wordsquare.js <size> <letters>");
    console.log("Example: node wordsquare.js 4 eeeeddoonnnsssrv");
    process.exit(1);
  }

  try {
    const dictionary = Dictionary.fromFile(path.join(__dirname, "enable1.txt"));
    const square = new WordSquareSolver(dictionary).solve(size, letters);
    console.log(square ? square.toString() : "No solution found");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

module.exports = { countLetters, LetterPool, WordSquare, Dictionary, WordSquareSolver };