# Wordle Solver README

## Overview

This repository contains a JavaScript script that automatically solves the popular word game Wordle. The script uses a letter frequency score system to efficiently guess the correct word. 

## What is Wordle?

Wordle is a web-based word game where the player has six attempts to guess a five-letter target word. After each guess, the game provides feedback in the form of colored tiles indicating:

- **Green**: The letter is in the correct position.
- **Yellow**: The letter is in the word but in the wrong position.
- **Gray**: The letter is not in the word.

The goal is to guess the target word within the six attempts using the feedback provided.

## Script Performance

The Wordle solving script has been tested on the entire dictionary of possible solutions with the following success rates:

- **Won**: 97.37%
- **Lost**: 2.20%
- **Unknown**: 0.43%

## How It Works

The script uses a letter frequency score system to make guesses. Here's a simplified explanation of the approach:

1. **Frequency Analysis**: Calculate the frequency of each letter in the dictionary of possible solutions.
2. **Scoring System**: Assign a score to each word based on the frequency of its letters.
3. **Guessing Strategy**: Start with a high-scoring word and adjust the list of possible solutions based on feedback from each guess.
4. **Iterative Process**: Repeat the process of guessing and filtering possible solutions until the target word is found or all attempts are exhausted.

## How to Use

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/yourusername/wordle-solver.git
    cd wordle-solver
    ```

2. **Run the Script**:
    - Ensure you have Node.js installed.
    - Execute the script using Node.js:
        ```sh
        node wordleSolver.js
        ```

3. **Observe the Output**:
    - The script will output each guess and the corresponding feedback.
    - Finally, it will display whether the target word was guessed correctly, lost, or if the result is unknown.

## Example

Here's a brief example of what running the script might look like:

```sh
Starting Wordle Solver...
Guess 1: CRANE
Feedback: ⬛🟨🟨⬛⬛
Guess 2: SOARE
Feedback: ⬛🟨⬛🟨⬛
Guess 3: ROATE
Feedback: 🟨🟨⬛⬛🟨
...
Success! The word is REACT.
```

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy Wordle Solving!
