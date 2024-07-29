'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  function getRow(letter){
    switch(letter.toUpperCase()){
      case 'A':
        return 0
      case 'B':
        return 1
      case 'C':
        return 2
      case 'D':
        return 3
      case 'E':
        return 4
      case 'F':
        return 5
      case 'G':
        return 6
      case 'H':
        return 7
      case 'I':
        return 8
      default:
        return null
    }
  }

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body
      if(!puzzle || !coordinate || !value){
        res.json({ error: 'Required field(s) missing' })
        return;
      }

      let conflict = []
      let row = getRow(coordinate.split('')[0])
      let col = coordinate.split('')[1] - 1
      console.log(row, col)

      if(!solver.validate(puzzle)){
        res.json({error: 'Invalid characters in puzzle'})
      }
      else if(puzzle.length < 81 || puzzle.length > 81){
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      else if(!/^[1-9]$/i.test(value)){
        res.json({ error: 'Invalid value' })
      }
      else if(coordinate.length !=2  ||
        !/[a-i]/i.test(coordinate.split('')[0]) ||
        !/[1-9]/i.test(coordinate.split('')[1]))
      {
        res.json({ error: 'Invalid coordinate'})
      }
      else{
        if(!solver.checkRowPlacement(puzzle, row, col, value)){
          conflict.push('row')
        }
        if(!solver.checkColPlacement(puzzle, row, col, value)){
          conflict.push('column')
        }
        if(!solver.checkRegionPlacement(puzzle, row, col, value)){
          conflict.push('region')
        }

        if(conflict.length === 0){
          res.json({valid: true})
        }else{
          res.json({valid: false, conflict: conflict})
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      if(!puzzle){
        res.json({ error: 'Required field missing' })
      }
      else if(!solver.validate(puzzle)){
        res.json({error: 'Invalid characters in puzzle'})
      }
      else if(puzzle.length < 81 || puzzle.length > 81){
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      else{
        const solved = solver.solve(puzzle)
        console.log('solved: ',solved)
        if(!solved){
          res.json({ error: 'Puzzle cannot be solved' })
        }
        else{
          res.json({solution: solved})
        }
      }
    });
};
