# Naimuri Coding Challenge

This challenge is to produce a **word square**. In a word square, you are given a grid with letters arranged that spell valid English words when read from left to right or from top to bottom. The word in each row is the same as the word in the column with the same number. For example, the first row and the first column spell the same word, the second row and the second column do too, and so on.

## Getting Started

### Prerequisites

- Git
- Node.js 18 or later

### Running the App

1. Clone the repository:

   ```bash
   git clone https://github.com/pjcollum/naimuri-wordsquare.git
   ```

2. Go into the project folder:

   ```bash
   cd naimuri-wordsquare
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the solver with a grid size and the letters:

   ```bash
   node wordsquare.js 4 eeeeddoonnnsssrv
   ```

### Running the Tests

```bash
npm test
```

## Challenge Description

Given an _n x n_ grid size and _n²_ letters, produce a valid word square using all of the letters.

### Input

An integer for the number of rows and columns, then the letters.

**Example:**
4 eeeeddoonnnsssrv

### Output

**Example:**

```
rose
oven
send
ends
```

## Results

```bash
node wordsquare.js 4 aaccdeeeemmnnnoo
node wordsquare.js 5 aaaeeeefhhmoonssrrrrttttw
node wordsquare.js 5 aabbeeeeeeeehmosrrrruttvv
node wordsquare.js 7 aaaaaaaaabbeeeeeeedddddggmmlloooonnssssrrrruvvyyy
```

| Input                                               | Output                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| 4 aaccdeeeemmnnnoo                                  | moan / once / acme / need                                           |
| 5 aaaeeeefhhmoonssrrrrttttw                         | feast / earth / armer / steno / throw                               |
| 5 aabbeeeeeeeehmosrrrruttvv                         | heart / ember / above / revue / trees                               |
| 7 aaaaaaaaabbeeeeeeedddddggmmlloooonnssssrrrruvvyyy | bravado / renamed / analogy / valuers / amoebas / degrade / odyssey |

## How It Works

The program builds the square one row at a time. Because each row is the same as its column, the rows already placed decide how the next row has to start. So it only tries words that begin with those letters.

If no word fits, it goes back a row and tries the next word there (backtracking). It keeps track of the letters as it goes, so it gives up on a word as soon as it would need a letter that has run out.

The square is stored as a list of words.

## Dictionary Resource

[enable1.txt](http://norvig.com/ngrams/enable1.txt), the dictionary suggested in the challenge.
