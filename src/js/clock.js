 const clock = document.querySelector('#clock')

 const startButton = document.querySelector('#start')
 const pauseButton = document.querySelector('#pause')
 const resetButton = document.querySelector('#reset')

 let isClockRunning = false

 // Quanto tempo irá durar a sessão (Pomodoro costuma durar 25 minutos) (60 * 25 = 1500 sec)
 let workSessionDuration = 60 * 25
 let currentTimeLeftInSession = 60 * 25
 
 // Quanto tempo irá durar o tempo de relax (Pomodoro costuma durar 5 minutos) (60 * 5 = 300 sec)
 let breakSession = 60 * 5

 let timeSpentInCurrentSession = 0
 let type = 'Work'

 let currentTaskLabel = document.querySelector('#pomodoro-clock-task')

 let updatedWorkSessionDuration
 let updatedBreakSessionDuration

 let workDurationInput = document.querySelector('#input-work-duration')
 let breakDurationInput = document.querySelector('#input-break-duration')

 workDurationInput.value = '25'
 breakDurationInput.value = '5'

 let isClockStopped = true

startButton.addEventListener('click', () => {
  toggleClock()
})

resetButton.addEventListener('click', () => {
 toggleClock(true)
})

workDurationInput.addEventListener('input', () => {
  updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
})

breakDurationInput.addEventListener('input', () => {
 updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
})


const minuteToSeconds = mins => {
  return mins * 60
}


const toggleClock = reset => {
  if (reset) {
    // Resetar o timer
    stopClock()
  } else {

    if (isClockStopped) {
      setUpdatedTimers()
      isClockStopped = false
    }

    if (isClockRunning === true) {
      // Pausa o setInterval que fica rodando no else
      clearInterval(clockTimer)
      isClockRunning = false
    } else {
      // Começa o timer
      clockTimer = setInterval(() => {
        stepDown()
        displayCurrentTimeLeftInSession()
      }, 1000);
      isClockRunning = true
    }
  }
}

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession
  let result = ''

  const seconds = secondsLeft % 60
  const minutes = parseInt(secondsLeft / 60) % 60
  let hours = parseInt(secondsLeft / 3600 )

  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time
  }

  if (hours > 0) result += `${hours}: `
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
  clock.innerHTML = result.toString()
}



const stopClock = () => {
  setUpdatedTimers()
  displaySessionLog(type)
  clearInterval(clockTimer)
  isClockStopped = true
  isClockRunning = false
  currentTimeLeftInSession = workSessionDuration

  displayCurrentTimeLeftInSession()

  type = 'Work'
  timeSpentInCurrentSession = 0
}


const stepDown = () => {
  if(currentTimeLeftInSession > 0) {
    currentTimeLeftInSession--
    timeSpentInCurrentSession++
  } else if (currentTimeLeftInSession === 0) {
    timeSpentInCurrentSession = 0
    if (type === 'Work') {
      currentTimeLeftInSession = breakSession
      displaySessionLog('Work')
      type = 'Break'
      setUpdatedTimers()
      currentTaskLabel.value = 'Break'
      currentTaskLabel.disabled = true
    } else {
      currentTimeLeftInSession = workSessionDuration
      type = 'Work'
      setUpdatedTimers()
      if (currentTaskLabel.value === 'Break') {
        currentTaskLabel.value = workSessionLabel
      }
      currentTaskLabel.disabled = false
      displaySessionLog('Break')
    }
  }
  displayCurrentTimeLeftInSession()
}



const displaySessionLog = type => {
  const sessionsList = document.querySelector('#pomodoro-sessions')
  const li = document.createElement('li')

  if (type === 'Work') {
    sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
    workSessionLabel = sessionLabel
  } else {
    sessionLabel = 'Break'
  }

  let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
  elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

  const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)

  li.appendChild(text)
  sessionsList.appendChild(li)
}


const setUpdatedTimers = () => {
  if(type === 'Work') {
    currentTimeLeftInSession = updatedWorkSessionDuration 
      ? updatedWorkSessionDuration 
      : workSessionDuration
    
    workSessionDuration = currentTimeLeftInSession

  } else {
    currentTimeLeftInSession = updatedBreakSessionDuration
      ? updatedBreakSessionDuration
      : breakSession
    
    breakSession = currentTimeLeftInSession
  }
}