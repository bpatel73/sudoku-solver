const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validInput = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidInput = '1.5..2.84..63.12.7.2..5.g...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Unit Tests', () => {
    test('Valid puzzle string of 81 characters', () => {
        const solved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        assert.equal(solver.solve(validInput), solved);
    });

    test('A puzzle string with invalid characters', () => {
        assert.equal(solver.solve(invalidInput), false);
    });

    test('A puzzle string that is not 81 characters in length', () => {
        const inputString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'
        assert.equal(solver.solve(inputString), false);
    });

    test('A valid row placement', () => {
        assert.isTrue(solver.checkRowPlacement(validInput, 0, 1, '3'));
    });

    test('An invalid row placement', () => {
        assert.equal(solver.checkRowPlacement(validInput, 0, 1, '8'), false);
    });

    test('A valid column placement', () => {
        assert.isTrue(solver.checkColPlacement(validInput, 1, 0, '9'));
    });

    test('An invalid column placement', () => {
        assert.isFalse(solver.checkColPlacement(validInput, 1, 0, '8'));
    });

    test('A valid region (3x3 grid) placement', () => {
        assert.isTrue(solver.checkRegionPlacement(validInput, 0, 4, '8'));
    });

    test('An invalid region (3x3 grid) placement', () => {
        assert.isFalse(solver.checkRegionPlacement(validInput, 0, 4, '1'));
    });

    test('Valid puzzle strings pass the solver', () => {
        const solved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        assert.equal(solver.solve(validInput), solved);
    });

    test('Invalid puzzle strings fail the solver', () => {
        assert.equal(solver.solve(invalidInput), false);
    })

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const solved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        assert.equal(solver.solve(validInput), solved);
    });
});
