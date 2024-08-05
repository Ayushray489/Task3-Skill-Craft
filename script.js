const player = 'X';
const computer = 'O';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let difficulty = 'easy';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function setDifficulty(level) {
    difficulty = level;
    resetGame();
}

function makeMove(index) {
    if (board[index] === '' && !gameOver) {
        board[index] = player;
        document.getElementById(`cell-${index}`).innerText = player;
        if (checkWin(player)) {
            document.getElementById('status').innerText = 'You win!';
            gameOver = true;
        } else if (board.includes('')) {
            computerMove();
        } else {
            document.getElementById('status').innerText = 'It\'s a tie!';
            gameOver = true;
        }
    }
}

function computerMove() {
    let move;
    if (difficulty === 'easy') {
        move = easyMove();
    } else if (difficulty === 'medium') {
        move = mediumMove();
    } else {
        move = hardMove();
    }

    board[move] = computer;
    document.getElementById(`cell-${move}`).innerText = computer;
    if (checkWin(computer)) {
        document.getElementById('status').innerText = 'Computer wins!';
        gameOver = true;
    } else if (!board.includes('')) {
        document.getElementById('status').innerText = 'It\'s a tie!';
        gameOver = true;
    }
}

function easyMove() {
    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function mediumMove() {
    // Try to win
    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (board[a] === computer && board[b] === computer && board[c] === '') return c;
        if (board[a] === computer && board[c] === computer && board[b] === '') return b;
        if (board[b] === computer && board[c] === computer && board[a] === '') return a;
    }
    // Try to block
    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    // Otherwise, make a random move
    return easyMove();
}

function hardMove() {
    // Use the minimax algorithm for the hardest level
    let bestMove = -1;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(computer)) return 10 - depth;
    if (checkWin(player)) return depth - 10;
    if (!board.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
    document.getElementById('status').innerText = '';
}
