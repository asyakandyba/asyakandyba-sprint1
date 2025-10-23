'use strict'

const LIFE = '♥️'
const LOSTLIFE = '💔'


function updateMarkedCount(diff) {
    gGame.markedCount += diff
    var remain = gLevel.mines - gGame.markedCount
    document.querySelector('span').innerText = remain
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(setSecs, 500)
}

function setSecs() {
    if (!gGame.isOn) return clearInterval(gTimerInterval)

    const elTimer = document.querySelector('.timer')
    const currTime = Date.now() - gStartTime
    const secs = Math.floor((currTime / 1000) % 60) + ''
    gGame.secsPassed = +secs
    elTimer.innerText = secs.padStart(2, '0')
}

function setSmiley(currSmiley) {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = currSmiley
}

function setLife(lifeCount) {
    var elLife = document.querySelector('.life')
    elLife.innerText = ''

    for (var i = 0; i < lifeCount; i++) {
        elLife.innerText += LIFE
    }
    for (var i = 0; i < 3 - lifeCount; i++) {
        elLife.innerText += LOSTLIFE
    }
}


