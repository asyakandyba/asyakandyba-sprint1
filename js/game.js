'use strict'

const MINE = '💣'
const MARK = '🚩'
const EMPTY = ' '

const NORMAL = '😋'
const LOSER = '😔'
const WINNER = '🤩'

var gBoard
var gStartTime
var gTimerInterval

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3,
    safeClicks: 3,
}

const gLevel = {
    size: 4,
    mines: 2,
}

const gLevels = [
    { size: 4 },
    { size: 8 },
    { size: 12 },
]

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    updateMarkedCount(0)
    setLife(gGame.life)
    setSmiley(NORMAL)
    setSafeClicks(gGame.safeClicks)
    setBestTime()
}

function buildBoard() {
    const board = createMat(gLevel.size, gLevel.size)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var cell = {
                minesAround: EMPTY,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }
    return board
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHtml = ''

    for (var i = 0; i < board.length; i++) {
        strHtml += '</tr>\n'

        for (var j = 0; j < board[i].length; j++) {

            strHtml += `<td class="cell cell-${i}-${j}"
             onclick="onCellClicked(this, ${i}, ${j})"
             oncontextmenu="onCellMarked(this, ${i}, ${j})">
             </td>`
        }
        strHtml += '</tr>\n'
    }
    elBoard.innerHTML = strHtml
}

function renderCell(elCell, value) {
    elCell.innerHTML = value
    elCell.classList.toggle('clicked')
}

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    var currValue = currCell.minesAround
    if (currCell.isMine) currValue = MINE

    if (gGame.markedCount === 0 && gGame.revealedCount === 0) {
        setMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
        gGame.isOn = true
        startTimer()
    }

    if (!gGame.isOn) return
    if (currCell.isMarked || currCell.isRevealed) return

    if (currValue === EMPTY && !currCell.isMine) {
        expandReveal(gBoard, i, j)
    } else if (currCell.isMine) {
        lostLife(elCell)
        if (gGame.life === 0) return gameLost()
    } else {
        gGame.revealedCount++
        currCell.isRevealed = true

        renderCell(elCell, currValue)
    }

    if (checkGameOver()) {
        gGame.isOn = false
        setSmiley(WINNER)
        getBestTime()
    }
}

function onCellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', event => { event.preventDefault() })
    const currCell = gBoard[i][j]

    if (gGame.markedCount === 0 && gGame.revealedCount === 0) {
        gGame.isOn = true
        startTimer()
    }

    if (currCell.isRevealed) return
    else if (currCell.isMarked) {
        updateMarkedCount(-1)
        currCell.isMarked = false

        renderCell(elCell, EMPTY)
    } else {
        updateMarkedCount(1)
        currCell.isMarked = true

        renderCell(elCell, MARK)
    }

    if (checkGameOver()) {
        gGame.isOn = false
        setSmiley(WINNER)
        getBestTime()
    }
}

function expandReveal(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue

            const currCell = board[i][j]
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)

            if (!currCell.isRevealed && !currCell.isMarked && !currCell.isMine) {
                gGame.revealedCount++
                currCell.isRevealed = true

                renderCell(elCurrCell, currCell.minesAround)
                if (currCell.minesAround === EMPTY) expandReveal(board, i, j)
            }
        }
    }
}

function lostLife(elCell) {
    gGame.life--
    setLife(gGame.life)

    if (gGame.life === 0) return

    renderCell(elCell, MINE)
    setSmiley(LOSER)

    setTimeout(() => {
        setSmiley(NORMAL)
        renderCell(elCell, EMPTY)
    }, 500)
}

function gameLost() {
    gGame.isOn = false
    revealMines(gBoard)
    setSmiley(LOSER)
}

function checkGameOver() {
    return (gGame.markedCount === gLevel.mines &&
        gGame.revealedCount + gGame.markedCount === gLevel.size ** 2)
}

function restart() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    gGame = {
        isOn: false,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        life: 3,
        safeClicks: 3,
    }

    clearInterval(gTimerInterval)
    document.querySelector('.timer').innerText = '00'

    setSmiley(NORMAL)
    updateMarkedCount(0)
    setLife(gGame.life)
    setSafeClicks(gGame.safeClicks)
}

function setLevel(elBtn) {
    gLevel.size = +elBtn.getAttribute('data-size')
    gLevel.mines = +elBtn.getAttribute('data-mines')
    restart()
}

function getBestTime() {
    const str = `best-time-${gLevel.size}x${gLevel.size}`
    const elBestTime = document.querySelector('.' + str + ' span')
    const currTime = gGame.secsPassed

    if (!localStorage.getItem(str) || currTime < localStorage.getItem(str)) {
        localStorage.setItem(str, currTime)
        gLevel.bestTime = currTime
        gLevel.bestTime = currTime
        setBestTime()
    }
    elBestTime.innerText = localStorage.getItem(str)
}

function setBestTime() {
    for (var i = 0; i < gLevels.length; i++) {
        const size = gLevels[i].size
        const str = `best-time-${size}x${size}`

        const elBestTime = document.querySelector('.' + str + ' span')
        elBestTime.innerText = localStorage.getItem(str)
    }
}



