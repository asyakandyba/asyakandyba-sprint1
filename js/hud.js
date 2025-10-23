'use strict'

const LIFE = '♥️'
const LOSTLIFE = '💔'
const SAFECLICK = '🔑'


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

function setSafeClicks(safeClicksCount) {
    var elSafeClicks = document.querySelector('.safe-clicks')
    elSafeClicks.innerHTML = ''

    for (var i = 0; i < safeClicksCount; i++) {
        elSafeClicks.innerHTML += `<p onclick="useSafeClick(this)">${SAFECLICK}</p>`
    }
}

function useSafeClick(elSafeClick) {
    const safeCell = getRandSafeCell(gBoard)
    const i = safeCell.i
    const j = safeCell.j
    const elCurrCell = document.querySelector(`.cell-${i}-${j}`)

    gGame.safeClicks--
    elSafeClick.innerHTML = ''
    renderCell(elCurrCell, gBoard[i][j].minesAround)

    setTimeout(() => {
        renderCell(elCurrCell, EMPTY)
    }, 1500);

}

function toggleDarkMode(elBtn) {
    const elHtmlBody = document.querySelector('body')

    if (elHtmlBody.getAttribute('data-theme') === 'dark') {
        elHtmlBody.setAttribute('data-theme', 'light')
        elBtn.innerText = 'Dark mode'
    } else {
        elHtmlBody.setAttribute('data-theme', 'dark')
        elBtn.innerText = 'Light mode'
    }
}


