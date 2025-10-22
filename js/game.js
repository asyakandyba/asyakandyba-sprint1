'use strict'
const MINE = '💣'
const MARK = '🚩'
const EMPTY = ' '

var gBoard

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
const gLevel = {
    size: 4,
    mines: 2,
}

function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
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

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    var currValue = currCell.minesAround

    if (currCell.isMarked) return
    if (currValue === EMPTY)  expandReveal(gBoard, i, j)

    gGame.revealedCount++
    currCell.isRevealed = true

    if (currCell.isMine) elCell.innerText = MINE
    else elCell.innerText = currCell.minesAround
    elCell.style.backgroundColor = 'var(--main-color)'

    if (checkGameOver()) gGame.isOn = false
    console.log(checkGameOver())
}

function onCellMarked(elCell, i, j) {
    document.addEventListener('contextmenu', event => { event.preventDefault() })
    const currCell = gBoard[i][j]

    if (currCell.isRevealed) return

    gGame.markedCount++
    currCell.isMarked = true

    elCell.innerText = MARK

    if (checkGameOver()) gGame.isOn = false
}

function checkGameOver() {
    return gGame.revealedCount + gGame.markedCount == gLevel.size ** 2
}

function expandReveal(board, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue

            const currCell = board[i][j]
            const elCurrCell = document.querySelector(`.cell-${i}-${j}`)

            if(!currCell.isRevealed && !currCell.isMarked){
                gGame.revealedCount++
                currCell.isRevealed = true
    
                elCurrCell.innerText = currCell.minesAround
                elCurrCell.style.backgroundColor = 'var(--main-color)'
            }
        }
    }
}