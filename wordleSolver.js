const fs = require('fs');

// Get words from text file and sort alphabetically
const getWords = () => {
    try {
        const text = fs.readFileSync('words.txt', 'utf8');
        const upperCaseWords = text.trim().split(',').map(word => word.toUpperCase().replace(/[^A-Z]/g, ''));
        
        return upperCaseWords.sort()
    }   
    catch (e) {
        console.log(`Failed to get words: `, e);
    }
}

/** 
 * Creates and array where  Each element in the array is a map 
 * where the keys represent the letters at each position. 
**/
const calculateLetterFrequencyCount = wordArray => {
    let letterFrequency = [];
    for (let i = 0; i < wordArray[0].length; i++) {
        let letterFrequencyMap = new Map();
        wordArray.forEach(word => {
            let char = word[i];
            let count = letterFrequencyMap.get(char) || 0;
            letterFrequencyMap.set(char, count + 1);
        });
        letterFrequency.push(letterFrequencyMap);
    }

    return letterFrequency
}

const frequencyScoreWords = (wordArray, letterFrequency) => {
    let frequencyScores = [];
    let maxScore = { word: '', score: 0 };
    let minScore = { word: '', score: Infinity };

    for (let word of wordArray) {
        let score = 0;
        for (let i = 0; i < word.length; i++) {
            const positionScore = letterFrequency[i].get(word[i]);
            score += positionScore;
        }
        if (score > maxScore.score) {
            maxScore = { word: word, score: score }
        }
        if (score < minScore.score) {
            minScore = { word: word, score: score }
        }
        frequencyScores.push({ word: word, score: score });
    }

    return { frequencyScores: frequencyScores, maxScore: maxScore, minScore: minScore };
}

const checkWord = (guess, solution, gameClass) => {
    // Remove letters from possible letters (these are added back if correct or misplaced)
    for (let i = 0; i < 5; i++) {
        gameClass.possibleLetters = gameClass.possibleLetters.filter(char => char !== guess[i]);
    }

    // Fill misplaced letters
    for (let i = 0; i < 5; i++) {
        if (gameClass.correctLetters[i] === '') {
            for (let j = 0; j < 5; j++) {
                if (guess[i] == solution[j]) {
                    gameClass.misplacedLetters.push({ letter: guess[i], index: i });
                    gameClass.possibleLetters.push(guess[i]);
                    break;
                }
            }
        }
    }

    // Fill correct letters
    for (let i = 0; i < 5; i++) {
        if (guess[i] == solution[i]) {
          gameClass.correctLetters[i] = guess[i];
          gameClass.possibleLetters.push(guess[i]);
          // remove misplaced letters if they've been correctly located
          gameClass.misplacedLetters = gameClass.misplacedLetters.filter(element => element.letter !== guess[i]);
        }
    }

}

// Create Wordle Game Class
class Game {
    constructor(allWords) {
        this.guessedWords = [];

        // start with alphabet of possible letters
        this.possibleLetters = ['A', 'B', 'C', 'D', 'E',  'F', 'G', 'H', 'I', 'J',  'K', 'L', 'M', 'N', 'O',  'P', 'Q', 'R', 'S', 'T',  'U', 'V', 'W', 'X', 'Y',  'Z'];

        // Correct but misplaced with index where it was geussed
        this.misplacedLetters = [];

        // Possible Answers
        this.possibleAnswers = [...allWords];

        // Correct letters
        this.correctLetters = ['', '', '', '', ''];

        // initialise letter frequency at each position and sort by score
        this.wordScores = frequencyScoreWords(allWords, calculateLetterFrequencyCount(allWords)).frequencyScores.sort((a, b) => b.score - a.score);
    }

    reset(allWords) {
        this.guessedWords = [];

        // start with alphabet of possible letters
        this.possibleLetters = ['A', 'B', 'C', 'D', 'E',  'F', 'G', 'H', 'I', 'J',  'K', 'L', 'M', 'N', 'O',  'P', 'Q', 'R', 'S', 'T',  'U', 'V', 'W', 'X', 'Y',  'Z'];

        // Correct but misplaced with index where it was geussed
        this.misplacedLetters = [];

        // Possible Answers
        this.possibleAnswers = [...allWords];

        // Correct letters
        this.correctLetters = ['', '', '', '', ''];

        // initialise letter frequency at each position and sort by score
        this.wordScores = frequencyScoreWords(allWords, calculateLetterFrequencyCount(allWords)).frequencyScores.sort((a, b) => b.score - a.score);
    }

    makeGuess() {
        for (let element of this.wordScores) {
            let validWord = this.filterOutIfGuessAlreadyUsed(element.word) && this.filterOutByCorrectLetters(element.word) && this.filterOutByPossibleLetters(element.word) && this.filterOutByMisplacedLetters(element.word);
            if (validWord) {
                this.guessedWords.push(element.word);
                return element.word;
            } 
        }
    }

    // results takes the form [N,N,N,N,N] where 0 is incorrect, 1 is misplaced and 2 is correct
    // 0,0,2,1,2
    updateAttributes(guess, results) {
        for (let i = 0; i < 5; i++) {
            if (results[i] == 0) {
                this.possibleLetters = this.possibleLetters.filter(char => char !== guess[i]);
            }
            if (results[i] == 1) {
                this.misplacedLetters.push({ letter: guess[i], index: i });
            }
            if (results[i] == 2) {
                this.correctLetters[i] = guess[i];
                this.misplacedLetters = this.misplacedLetters.filter(element => element.letter !== guess[i]);   
                this.possibleLetters.push(guess[i]);
            }
        }
    }

    filterOutIfGuessAlreadyUsed(guess) {
        let isValid = true;

        if (this.guessedWords.includes(guess)) {
            isValid = false;
        }

        return isValid;
    }

    filterOutByPossibleLetters(guess) {
        let isValid = true; 

        for (let char of guess) {
            if (!(this.possibleLetters.includes(char))) {
                
                isValid = false
            }
        }

        return isValid
    } 

    filterOutByCorrectLetters(guess) {
        let isValid = true;

        for (let i = 0; i < 5; i++) {
            if (this.correctLetters[i] !== '') {
                if (this.correctLetters[i] !== guess[i]) {

                    isValid = false
                }
            }
        }

        return isValid
    }

    filterOutByMisplacedLetters(guess) {
        let isValid = true;

        this.misplacedLetters.forEach(element => {
            // if the guess doesn't have one of the misplaced letters remove it
            if (!(guess.split('').includes(element.letter))) {

                isValid = false
            }
            for (let i = 0; i < 5; i++) {
                // if the guess has the misplaced letter but in an index already used, remove it
                if (guess[i] == element.letter && element.index == i) {
                    
                    isValid = false
                }
                // if the guess has the misplaced letter but in an index which is already taken by a correct letter remove it
                // if (guess[i] == element.letter && this.correctLetters[i] != '') {

                //     isValid = false
                // }
            }
        });

        return isValid
    }

    testing() {
        let testingResults = {
            'unknown': [],
        }

        const words = getWords();
        
        for (let word of words) {
            let tries = 0;
            let unknown = true;
            // console.log(`The solution is: ${word}`)
            while (tries < 9) {
                let guess = this.makeGuess();
                checkWord(guess, word, this);
                tries++;
                if (this.correctLetters.join('') == word) {
                    if (testingResults[tries]) {
                        testingResults[tries].push(word);
                    }
                    else {
                        testingResults[tries] = [word];
                    }
                    unknown = false;
                    break;
                }
            }
            if (unknown) {
                testingResults['unknown'].push(word);
            }
            
            this.reset(words)
        }

        return testingResults;
    }

}


const words = getWords();
const myGame = new Game(words);

const results = myGame.testing();
console.log(results);
const won = results[1].length + results[2].length + results[3].length + results[4].length + results[5].length + results[6].length;
const lost = results[7].length;
console.log(`won: ${won / words.length * 100}% --- lost: ${lost / words.length * 100}% --- unknown: ${(words.length - won - lost) / words.length * 100}%`)

// const letterFrequency = calculateLetterFrequencyCount(words);
// const unknownScores = frequencyScoreWords(results.unknown, letterFrequency);
// console.log(unknownScores)

// let count = 0;
// let astes = [];
// words.forEach(word => {
//     let ending = word[2] + word[4];
//     if (ending == 'OY') {
//         count++;
//         astes.push(word);
//     }
// })
// console.log(count, astes)
// const index = myGame.wordScores.findIndex(element => element.word == 'PASTE');
// console.log(myGame.wordScores[index]);

// let solution = 'AFOOT';
// let guess = myGame.makeGuess();
// checkWord(guess, solution, myGame);
// console.log(guess);
// console.log(myGame.correctLetters, myGame.misplacedLetters, myGame.possibleLetters);
// guess = myGame.makeGuess();
// checkWord(guess, solution, myGame);
// console.log(guess);
// console.log(myGame.correctLetters, myGame.misplacedLetters, myGame.possibleLetters);
// guess = myGame.makeGuess();
// checkWord(guess, solution, myGame);
// console.log(guess);
// console.log(myGame.correctLetters, myGame.misplacedLetters, myGame.possibleLetters);
// guess = myGame.makeGuess();
// checkWord(guess, solution, myGame);
// console.log(guess);
// console.log(myGame.correctLetters, myGame.misplacedLetters, myGame.possibleLetters);
// guess = myGame.makeGuess();
// checkWord(guess, solution, myGame);
// console.log(guess);

// guess = myGame.makeGuess();
// console.log(guess)
// myGame.updateAttributes(guess, [0,0,0,0,1]);
// guess = myGame.makeGuess();
// console.log(guess)


console.log(myGame.correctLetters, myGame.misplacedLetters, myGame.possibleLetters);
console.log(myGame.filterOutByPossibleLetters('EBONY'));
console.log(myGame.filterOutByMisplacedLetters('EBONY'));
console.log(myGame.filterOutByCorrectLetters('EBONY'));




