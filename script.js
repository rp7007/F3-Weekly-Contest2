const activeTimers = [];

function startNewTimer() {
  const hours = parseInt(document.getElementById('hours').innerText);
  const minutes = parseInt(document.getElementById('minutes').innerText);
  const seconds = parseInt(document.getElementById('seconds').innerText);

  // Validate user input
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    alert('Please enter valid time values.');
    return;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds <= 0) {
    alert('Please enter a positive time value.');
    return;
  }

  const timer = {
    totalSeconds,
    timeLeft: totalSeconds,
    intervalId: null
  };

  activeTimers.push(timer);
  updateActiveTimersDisplay();
  startCountdowns();
}

function updateActiveTimersDisplay() {
  const activeTimersContainer = document.querySelector('.active-timers');
  activeTimersContainer.innerHTML = '';

  activeTimers.forEach((timer, index) => {
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('active-timer');

    if (timer.timeLeft <= 0) {
      // Add "Timer Is Up!" and "Stop" button if the timer has ended
      timerDisplay.innerHTML = `
        <p>Timer Is Up!</p>
        <button class="stop-button" data-index="${index}">Stop</button>
      `;

      timerDisplay.classList.add('past-timer');
      const stopButton = timerDisplay.querySelector('.stop-button');
      stopButton.addEventListener('click', stopTimer.bind(null, index));
    } else {
      // Add the regular timer display if the timer is still running
      timerDisplay.innerHTML = `
        <p>Time Left: ${formatTime(timer.timeLeft)}</p>
        <button class="delete-button" data-index="${index}">Delete</button>
      `;

      const deleteButton = timerDisplay.querySelector('.delete-button');
      deleteButton.addEventListener('click', deleteTimer.bind(null, index));
    }

    activeTimersContainer.appendChild(timerDisplay);
  });
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

function startCountdowns() {
  activeTimers.forEach((timer, index) => {
    if (!timer.intervalId && timer.timeLeft > 0) {
      timer.intervalId = setInterval(() => {
        timer.timeLeft--;
        if (timer.timeLeft <= 0) {
          clearInterval(timer.intervalId);
          timer.intervalId = null;
          onTimerEnd(index);
        } else {
          updateActiveTimersDisplay();
        }
      }, 1000);
    }
  });
}

function onTimerEnd(index) {
  updateActiveTimersDisplay();
}

function stopTimer(index) {
  const timer = activeTimers[index];
  clearInterval(timer.intervalId);
  timer.intervalId = null;
  activeTimers.splice(index, 1);
  updateActiveTimersDisplay();
}

function deleteTimer(index) {
  const timer = activeTimers[index];
  clearInterval(timer.intervalId);
  activeTimers.splice(index, 1);
  updateActiveTimersDisplay();
}

document.getElementById('start-timer').addEventListener('click', startNewTimer);
