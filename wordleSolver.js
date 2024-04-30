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
        this.correctLetters = {0: '', 1: '', 2: '', 3: '', 4: ''};

        // 

    }
}







const words = getWords();
const frequencyCount = calculateLetterFrequencyCount(words);
const scores = frequencyScoreWords(words, frequencyCount);

console.log(scores.maxScore);

