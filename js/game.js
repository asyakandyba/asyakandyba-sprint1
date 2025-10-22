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

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3,
}

const gLevel = {
    size: 4,
    mines: 2,
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    setLife(gGame.life)
    setSmiley(NORMAL)

    document.querySelector('h2 span').innerText = gLevel.mines
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

    board[1][1].isMine = true
    board[1][2].isMine = true
    // for (var i = 0; i < gLevel.mines; i++) {
    //     setMine(board)
    // }
    setMinesNegsCount(board)

    console.log('board:', board)
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
    console.log('elBoard:', elBoard)
}

function renderCell(elCell, value) {
    elCell.innerHTML = value
    elCell.classList.toggle('clicked')
}

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    var currValue = currCell.minesAround

    if (gGame.markedCount === 0 && gGame.revealedCount === 0) {
        gGame.isOn = true
        startTimer()
    }

    if (!gGame.isOn) return
    if (currCell.isMarked || currCell.isRevealed) return

    if (currValue === EMPTY && !currCell.isMine) {
        expandReveal(gBoard, i, j)
    }

    gGame.revealedCount++
    currCell.isRevealed = true

    if (currCell.isMine) {
        gGame.isOn = false
        revealMines(gBoard)
        setSmiley(LOSER)
    } else {
        renderCell(elCell, currValue)
    }

    if (checkGameOver()) gGame.isOn = false
    console.log(checkGameOver())
}

function onCellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', event => { event.preventDefault() })
    const currCell = gBoard[i][j]

    if (gGame.markedCount === 0 && gGame.revealedCount === 0) {
        gGame.isOn = true
    }

    if (!gGame.isOn) return
    if (currCell.isRevealed) {
        return
    } else if (currCell.isMarked) {
        currCell.isMarked = false
        updateMarkedCount(-1)

        renderCell(elCell, EMPTY)
    } else {
        currCell.isMarked = true
        updateMarkedCount(1)

        renderCell(elCell, MARK)
    }

    if (checkGameOver()) gGame.isOn = false
}

function expandReveal(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue

            const currCell = board[i][j]
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)

            if (!currCell.isRevealed && !currCell.isMarked) {
                gGame.revealedCount++
                currCell.isRevealed = true

                renderCell(elCurrCell, currCell.minesAround)
            }
        }
    }
}

function checkGameOver() {
    return gGame.revealedCount + gGame.markedCount == gLevel.size ** 2
}

function restart() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    gGame.isOn = false
    gGame.markedCount = 0
    gGame.revealedCount = 0
    gGame.secsPassed = 0
    
    clearInterval(gTimerInterval)
    document.querySelector('h2 span').innerText = gLevel.mines
    document.querySelector('.timer').innerText = '00'
    setSmiley(NORMAL)
}

function setLevel(elBtn) {
    gLevel.size = elBtn.getAttribute('data-size')
    gLevel.mines = elBtn.getAttribute('data-mines')
    restart()
}




