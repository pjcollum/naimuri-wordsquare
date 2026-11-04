const path = require("path");
const { countLetters, LetterPool, WordSquare, Dictionary, WordSquareSolver } = require("./wordsquare");

// Core logic

test("nextPrefix gives the start of the next row", () => {
  const square = new WordSquare(["moan", "once"]);
  expect(square.nextPrefix()).toBe("ac");
});

test("useLetters uses the diagonal letter once and the rest twice", () => {
  // moan in row 0, m once, o a n twice = 7 letters
  const pool = new LetterPool("mooaann");
  pool.useLetters("moan", 0);
  expect(pool.isEmpty()).toBe(true);
});

// The challenges

const dictionary = Dictionary.fromFile(path.join(__dirname, "enable1.txt"));

// test.each runs the same test once for each puzzle in the list
test.each([
  [4, "eeeeddoonnnsssrv"],
  [4, "aaccdeeeemmnnnoo"],
  [5, "aaaeeeefhhmoonssrrrrttttw"],
  [5, "aabbeeeeeeeehmosrrrruttvv"],
  [7, "aaaaaaaaabbeeeeeeedddddggmmlloooonnssssrrrruvvyyy"],
])("solves %i %s", (size, letters) => {
  const square = new WordSquareSolver(dictionary).solve(size, letters);

  expect(square).not.toBeNull();
  expect(square.isValid()).toBe(true);
  expect(countLetters(square.rows.join(""))).toEqual(countLetters(letters));
  for (const word of square.rows) {
    expect(dictionary.words).toContain(word);
  }
});