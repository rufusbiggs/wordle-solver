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
console.log(calculateLetterFrequencyCount(getWords()));