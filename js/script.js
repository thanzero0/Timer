let timeLeft;
let timerId = null;
let isPaused = false;
let totalSeconds = 0;

const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const inputGroup = document.getElementById('timer-inputs');
const hrInput = document.getElementById('hours');
const minInput = document.getElementById('minutes');
const secInput = document.getElementById('seconds');
const container = document.querySelector('.container');

function updateDisplay(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    display.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId === null) {
        const hrs = parseInt(hrInput.value) || 0;
        const mins = parseInt(minInput.value) || 0;
        const secs = parseInt(secInput.value) || 0;
        totalSeconds = (hrs * 3600) + (mins * 60) + secs;

        if (totalSeconds <= 0) return;

        timeLeft = totalSeconds;
        container.classList.add('running');
        display.classList.add('active');
        startBtn.textContent = 'Pause';
        
        runCountdown();
    } else if (isPaused) {
        isPaused = false;
        startBtn.textContent = 'Pause';
        runCountdown();
    } else {
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
    startBtn.style.display = 'none';
}

function reset() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    
    container.classList.remove('running');
    display.classList.remove('active');
    
    hrInput.value = '';
    minInput.value = '';
    secInput.value = '';
    updateDisplay(0);
    
    startBtn.textContent = 'Start';
    startBtn.style.display = 'block';
}

// Scroll Picker Logic & Limits
function handleWheel(e) {
    e.preventDefault();
    const input = e.target;
    const step = e.deltaY > 0 ? -1 : 1;
    let val = parseInt(input.value || 0) + step;
    
    const max = input.id === 'hours' ? 99 : 59;
    
    if (val > max) val = 0;
    if (val < 0) val = max;
    
    input.value = val.toString().padStart(2, '0');
    handleInputUpdate();
}

function validateInput(e) {
    const input = e.target;
    const max = input.id === 'hours' ? 99 : 59;
    let val = parseInt(input.value);
    
    if (val > max) input.value = max;
    if (val < 0) input.value = 0;
    if (input.value.length > 2) input.value = input.value.slice(0, 2);
    
    handleInputUpdate();
}

function handleInputUpdate() {
    const hrs = parseInt(hrInput.value) || 0;
    const mins = parseInt(minInput.value) || 0;
    const secs = parseInt(secInput.value) || 0;
    updateDisplay((hrs * 3600) + (mins * 60) + secs);
}

[hrInput, minInput, secInput].forEach(input => {
    input.addEventListener('wheel', handleWheel, { passive: false });
    input.addEventListener('input', validateInput);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startTimer();
    });
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', reset);

// Initial display
updateDisplay(0);
