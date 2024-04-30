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

    // Fill correct letters
    for (let i = 0; i < 5; i++) {
        if (guess[i] == solution[i]) {
          gameClass.correctLetters[i] = guess[i];
          gameClass.possibleLetters.push(guess[i]);
        }
    }

    // Fill misplaced letters
    for (let i = 0; i < 5; i++) {
        if (gameClass.correctLetters[i] === '') {
            for (let j = 0; j < 5; j++) {
                if (guess[i] == solution[j]) {
                    gameClass.misplacedLetters.push(guess[i]);
                    gameClass.possibleLetters.push(guess[i]);
                    break;
                }
            }
        }
    }

}

// Create Wordle Game Class
class Game {
    constructor(allWords) {
        // start with alphabet of possible letters
        this.possibleLetters = ['A', 'B', 'C', 'D', 'E',  'F', 'G', 'H', 'I', 'J',  'K', 'L', 'M', 'N', 'O',  'P', 'Q', 'R', 'S', 'T',  'U', 'V', 'W', 'X', 'Y',  'Z'];

        // Correct but misplaced
        this.misplacedLetters = [];

        // Possible Answers
        this.possibleAnswers = [...allWords];

        // Correct letters
        this.correctLetters = ['', '', '', '', ''];

        // initialise letter frequency at each position and sort by score
        this.wordScores = frequencyScoreWords(allWords, calculateLetterFrequencyCount(allWords)).frequencyScores.sort((a, b) => b.score - a.score);
    }

    makeGuess() {
        for (let word of this.wordScores) {

        }
    }

    filterOutByPossibleLetters(guess) {
        for (let char of guess) {
            if (!(this.possibleLetters.includes(char))) {
                
                return false
            }
        }

        return true
    } 

    filterOutByCorrectLetters(guess) {
        for (let i = 0; i < 5; i++) {
            if (this.correctLetters[i] !== '') {
                if (this.correctLetters[i] !== guess[i]) {

                    return false
                }
            }
        }

        return true
    }

    filterOutByMisplacedLetters(guess) {
        
    }
}


const words = getWords();
const myGame = new Game(words);

console.log(myGame.wordScores);

// make a guess function
const makeGuess = myGame => {

}


// function to play the game
const playGame = (myGame, solution) => {
    let i = 0;
    let win = false;
    while (i < 6 && !win) {
        for (let word in myGame.scores) {
            if ()
        }
    }
}
checkWord('TEAMS', 'MATES', myGame);

