'use strict'

const LIFE = '♥️'
const LOSTLIFE = '💔'
const SAFECLICK = '🔑'
const HINT = '💡'

function setMarks(levels){
    for(var i=0;i<levels.length;i++){
        if(gLevel.size===gLevels[i].size){
            gLevel.mines = gLevels[i].mines
        }
    }
    document.querySelector('span').innerText = gLevel.mines
}

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

    const elTimer = document.querySelector('.timer span')
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

    for (var i = 0; i < 3; i++) {
        if (lifeCount !== 0) {
            elLife.innerText += LIFE
            lifeCount--
            continue
        } else {
            elLife.innerText += LOSTLIFE
        }
    }
}

function setHints(hintsCount) {
    var elHInts = document.querySelector('.hints')
    elHInts.innerHTML = ''

    for (var i = 0; i < hintsCount; i++) {
        elHInts.innerHTML += `<p onclick="useHint(this)">${HINT}</p>`
    }
}

function useHint(elHint) {
    if (gGame.isHintOn) return
    gGame.isHintOn = true
    elHint.classList.add('used-hint')
}

function showHint(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue

            const currCell = board[i][j]
            var currValue = getValue(gBoard, i, j)
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            const elUsedHint = document.querySelector('.used-hint')

            if (!currCell.isRevealed && !currCell.isMarked) {
                renderCell(elCurrCell, currValue)

                setTimeout(() => {
                    renderCell(elCurrCell, EMPTY)
                    elUsedHint.remove()
                    gGame.isHintOn = false
                }, 1500)
            }
        }
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
    const currValue = getValue(gBoard, i, j)
    const elCurrCell = document.querySelector(`.cell-${i}-${j}`)

    gGame.safeClicks--
    elSafeClick.remove()
    renderCell(elCurrCell, currValue)

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


