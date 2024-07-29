class SudokuSolver {

  validate(puzzleString) {
    const regex = /[^0-9.]/g
    if(regex.test(puzzleString))
      return false

    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzle = []
    for (let i=0; i<puzzleString.length; i++){
      let index = Math.floor(i / 9)
      if(!puzzle[index]){
        puzzle[index] = []
      }
      puzzle[index].push(puzzleString[i])
    }

    if(this.isInPlace(puzzleString, row , column, value)){
      return true
    }
    
    let searchRow = puzzle[row]
    for(let i=0; i<searchRow.length; i++){
      if(searchRow[i] === value){
        return false
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let puzzle = []
    for (let i=0; i<puzzleString.length; i++){
      let index = i % 9
      if(!puzzle[index]){
        puzzle[index] = []
      }
      puzzle[index].push(puzzleString[i])
    }
    if(this.isInPlace(puzzleString, row , column, value)){
      return true
    }
    
    let searchCol = puzzle[column]
    for(let i=0; i<searchCol.length; i++){
      if(searchCol[i] === value){
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let puzzle = []
    for(let i=0; i<puzzleString.length; i++){
      let r = Math.floor(i/9)
      let c = i % 9
      let index = Math.floor(r/3) * 3 + Math.floor(c / 3)
      if(!puzzle[index]){
        puzzle[index] = []
      }
      puzzle[index].push(puzzleString[i])
    }
    if(this.isInPlace(puzzleString, row , column, value)){
      return true
    }
    
    let idx = Math.floor(row/3) * 3 + Math.floor(column/3)
    let searchRegion = puzzle[idx]
    for(let i=0; i<searchRegion.length; i++){
      if(searchRegion[i] === value){
        return false
      }
    }
    return true
  }

  isInPlace(puzzleString, row, column, value){
    const board = this.stringToBoard(puzzleString)
    if(board[row][column] === value){
      return true
    }else{
      return false
    }
  }

  stringToBoard(puzzleString) {
    let board = [];
    for (let i = 0; i < 9; i++) {
      board.push(puzzleString.slice(i * 9, (i + 1) * 9).split(''));
    }
    return board;
  }

  boardToString(board) {
    let solvedString = '';
    for (let i = 0; i < 9; i++) {
      solvedString += board[i].join('');
    }
    return solvedString;
  }

  isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + i % 3;
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }

  solveBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            const char = num.toString();
            if (this.isValid(board, row, col, char)) {
              board[row][col] = char;
              if (this.solveBoard(board)) {
                return true;
              }
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    console.log(puzzleString)
    const board = this.stringToBoard(puzzleString)
    if(this.solveBoard(board)){
      return this.boardToString(board)
    }else{
      return ''
    }
    
  }
}

module.exports = SudokuSolver;

