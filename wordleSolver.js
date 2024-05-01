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

    for (let word of wordArray) {
        let score = 0;
        for (let i = 0; i < word.length; i++) {
            const positionScore = letterFrequency[i].get(word[i]);
            score += positionScore;
        }
        if (score > maxScore.score) {
            maxScore = { word: word, score: score }
        }
        frequencyScores.push({ word: word, score: score });
    }

    return { frequencyScores: frequencyScores, maxScore: maxScore };
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
        this.solution = 'MATEY'

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
            let validWord = this.filterOutByCorrectLetters(element.word) && this.filterOutByPossibleLetters(element.word) && this.filterOutByMisplacedLetters(element.word);
            if (validWord) {
                checkWord(element.word, this.solution, this);
                console.log(`Guessing ${element.word}`);
                console.log(`Correct: ${this.correctLetters}`);
                this.misplacedLetters.forEach(element => console.log(element.letter + element.index));
                console.log(`Possible letters: ${this.possibleLetters}`);

                return;
            } else {
                console.log(`${element.word} rejected!`)
            }
        }
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
                if (guess[i] == element.letter && this.correctLetters[i] != '') {

                    isValid = false
                }
            }
        });

        return isValid
    }

}


const words = getWords();
const myGame = new Game(words);
// console.log(myGame.wordScores)
// myGame.makeGuess();
// // console.log(myGame.misplacedLetters);
// myGame.makeGuess();
// myGame.makeGuess();
// myGame.makeGuess();

// console.log(myGame.wordScores);
// checkWord('ASSET', 'MATES', myGame);
// console.log(myGame.possibleLetters, myGame.misplacedLetters, myGame.correctLetters);
myGame.makeGuess();
myGame.makeGuess();
myGame.makeGuess();
myGame.makeGuess();
// checkWord('DEARS', 'MATES', myGame);
// console.log(myGame.possibleLetters, myGame.misplacedLetters, myGame.correctLetters);
// checkWord('SEARS', 'MATES', myGame);
// console.log(myGame.possibleLetters, myGame.misplacedLetters, myGame.correctLetters);

// console.log(myGame.filterOutByPossibleLetters('FEARS'));
// console.log(myGame.filterOutByCorrectLetters('FEARS'));
// console.log(myGame.filterOutByMisplacedLetters('FEARS'));

// make a guess function
const makeGuess = myGame => {

}


// function to play the game
// const playGame = (myGame, solution) => {
//     let i = 0;
//     let win = false;
//     while (i < 6 && !win) {
//         for (let word in myGame.scores) {
//             if ()
//         }
//     }
// }


