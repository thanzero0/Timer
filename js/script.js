let timeLeft = 1500; // 25 minutes default
let timerId = null;
let isPaused = true;
let currentModeTime = 1500;

const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

function updateDisplay(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.title = `${display.textContent} - Pomodoro`;
}

function startTimer() {
    if (isPaused) {
        // Start/Resume
        isPaused = false;
        startBtn.textContent = 'Pause';
        startBtn.classList.add('primary');
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                isPaused = true;
                startBtn.textContent = 'Start';
                alert('Time is up!');
                reset();
            }
        }, 1000);
    } else {
        // Pause
        isPaused = true;
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume';
    }
}

function reset() {
    clearInterval(timerId);
    timerId = null;
    isPaused = true;
    timeLeft = currentModeTime;
    updateDisplay(timeLeft);
    startBtn.textContent = 'Start';
    startBtn.classList.add('primary');
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Switch modes
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentModeTime = parseInt(btn.dataset.time);
        reset();
    });
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', reset);

// Initial display
updateDisplay(timeLeft);
