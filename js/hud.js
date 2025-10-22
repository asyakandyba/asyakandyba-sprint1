'use strict'

const LIFE = '♥️'

function updateMarkedCount(diff) {
    gGame.markedCount += diff
    var remain = gLevel.mines - gGame.markedCount
    h2.querySelector('span').innerText = remain
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(setSecs, 500)
}

function setSecs() {
    if (!gGame.isOn) clearInterval(gTimerInterval)

    const elTimer = document.querySelector('.timer')
    gGame.secsPassed = Date.now() - gStartTime

    const secs = Math.floor((gGame.secsPassed / 1000) % 60) + ''
    elTimer.innerText = secs.padStart(2, '0')
}

function setSmiley(currSmiley){
    var elSmiley = document.querySelector('.smiley')
    console.log('elSmiley:', elSmiley)
    elSmiley.innerText = currSmiley
}

function setLife(lifeCount) {
    var elLife = document.querySelector('.life')
    for (var i = 0; i < lifeCount; i++) {
        elLife.innerText += LIFE
    }
}

