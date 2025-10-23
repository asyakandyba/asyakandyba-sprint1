'use strict'

function setMines(board, i, j) {
    var placedMines = 0

    while (placedMines < gLevel.mines) {
        const rowIdx = getRandomInt(0, board.length)
        const colIdx = getRandomInt(0, board.length)

        if (rowIdx === i && colIdx === j) continue
        if (board[rowIdx][colIdx].isMine) continue
        board[rowIdx][colIdx].isMine = true
        placedMines++
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const count = minesAroundCount(board, i, j)

            if (count > 0) currCell.minesAround = count
            else currCell.minesAround = EMPTY
        }
    }
}

function minesAroundCount(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function revealMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) {
                gGame.revealedCount++
                currCell.isRevealed = true

                const elCurrCell = document.querySelector(`.cell-${i}-${j}`)
                renderCell(elCurrCell, MINE)
            }
        }
    }
}


