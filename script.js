const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackMessage = document.getElementById('feedback-message');
const attemptsCount = document.getElementById('attempts-count');
const remainingAttemptsCount = document.getElementById('remaining-attempts');
const timeDisplay = document.getElementById('time');
const resetBtn = document.getElementById('reset-btn');
const highScoreDisplay = document.getElementById('high-score');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');

let randomNumber = Math.floor(Math.random() * 100) + 1;
let attemptsUsed = 0;  // Number of attempts used
let remainingAttempts = 10;  // Remaining attempts
let timeElapsed = 0;
let timer;
let highScore = localStorage.getItem('highScore') || Infinity;
let gameOver = false;

// Update High Score
highScoreDisplay.textContent = highScore === Infinity ? "--" : highScore;

function startTimer() {
    timer = setInterval(() => {
        if (gameOver) return;
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

submitBtn.addEventListener('click', () => {
    if (gameOver) return;

    const userGuess = parseInt(guessInput.value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        feedbackMessage.textContent = "Please enter a number between 1 and 100.";
        feedbackMessage.style.color = "red";
        return;
    }

    attemptsUsed++;
    remainingAttempts--;
    attemptsCount.textContent = attemptsUsed;
    remainingAttemptsCount.textContent = remainingAttempts;

    if (userGuess === randomNumber) {
        feedbackMessage.textContent = `Correct! You guessed the number in ${attemptsUsed} attempts and ${timeDisplay.textContent}.`;
        feedbackMessage.style.color = "green";
        correctSound.play();

        stopTimer();

        if (attemptsUsed < highScore) {
            highScore = attemptsUsed;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.textContent = highScore;
        }

        gameOver = true;
        resetBtn.style.display = "block";
    } else if (remainingAttempts <= 0) {
        feedbackMessage.textContent = `Game Over! You've used all 10 attempts. The correct number was ${randomNumber}.`;
        feedbackMessage.style.color = "red";
        stopTimer();
        gameOver = true;
        resetBtn.style.display = "block";
    } else {
        feedbackMessage.textContent = userGuess < randomNumber ? "Too low! Try again." : "Too high! Try again.";
        feedbackMessage.style.color = "orange";
        incorrectSound.play();
    }

    guessInput.value = '';
});

resetBtn.addEventListener('click', () => {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attemptsUsed = 0;
    remainingAttempts = 10;
    attemptsCount.textContent = attemptsUsed;
    remainingAttemptsCount.textContent = remainingAttempts;
    feedbackMessage.textContent = '';
    guessInput.value = '';
    resetBtn.style.display = "none";
    timeElapsed = 0;
    timeDisplay.textContent = "00:00";
    gameOver = false;
    startTimer();
});

startTimer();
