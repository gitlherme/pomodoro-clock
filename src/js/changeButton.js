const buttonPlayPause =  document.querySelector('#button-play-pause-i')
const buttonReset = document.querySelector('#button-reset-i')

buttonPlayPause.addEventListener('click', () => {
  if (buttonPlayPause.className === 'fas fa-play') {
    buttonPlayPause.className = 'fas fa-pause'
  } else {
    buttonPlayPause.className = 'fas fa-play'
  }
})

buttonReset.addEventListener('click', () => {
    buttonPlayPause.className = 'fas fa-play'
})


