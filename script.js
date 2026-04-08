let timeLeft;
let timerId = null;
let isPaused = false;
let totalSeconds = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const inputGroup = document.getElementById('timer-inputs');
const minInput = document.getElementById('minutes');
const secInput = document.getElementById('seconds');
const container = document.querySelector('.container');

function updateDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId === null) {
        // Initial start
        const mins = parseInt(minInput.value) || 0;
        const secs = parseInt(secInput.value) || 0;
        totalSeconds = (mins * 60) + secs;

        if (totalSeconds <= 0) return;

        timeLeft = totalSeconds;
        inputGroup.style.display = 'none';
        display.style.fontSize = '8rem';
        container.classList.add('running');
        startBtn.textContent = 'Pause';
        
        runCountdown();
    } else if (isPaused) {
        // Resume
        isPaused = false;
        startBtn.textContent = 'Pause';
        runCountdown();
    } else {
        // Pause
        isPaused = true;
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume';
    }
}

function runCountdown() {
    if (timerId) clearInterval(timerId);
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            completeTimer();
        }
    }, 1000);
}

function completeTimer() {
    container.classList.remove('running');
    display.classList.add('active');
    startBtn.style.display = 'none';
    
    // Simple visual ping
    let flash = 5;
    const interval = setInterval(() => {
        display.style.opacity = display.style.opacity === '0' ? '1' : '0';
        flash--;
        if (flash < 0) {
            clearInterval(interval);
            display.style.opacity = '1';
        }
    }, 300);
}

function reset() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    
    inputGroup.style.display = 'flex';
    display.style.fontSize = '6rem';
    display.classList.remove('active');
    container.classList.remove('running');
    
    minInput.value = '';
    secInput.value = '';
    updateDisplay(0);
    
    startBtn.textContent = 'Start';
    startBtn.style.display = 'block';
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', reset);

// Handle Enter key for starting
[minInput, secInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startTimer();
    });
});

// Update display when inputting
minInput.addEventListener('input', () => {
    const mins = parseInt(minInput.value) || 0;
    const secs = parseInt(secInput.value) || 0;
    updateDisplay((mins * 60) + secs);
});

secInput.addEventListener('input', () => {
    const mins = parseInt(minInput.value) || 0;
    const secs = parseInt(secInput.value) || 0;
    updateDisplay((mins * 60) + secs);
});
