'use strict'

function createMat(rows, cols) {
    const mat = []

    for (var i = 0; i < rows; i++) {
        const row = []

        for (var j = 0; j < cols; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat.push([...mat[i]])
    }
    return newMat
}

//change acording to game!
function getRandSafeCell(board) {
    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            if (currCell.isMine) continue
            if (currCell.isRevealed) continue
            emptyCells.push({ i, j })
        }
    }
    if (!emptyCells.length) return null

    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}
