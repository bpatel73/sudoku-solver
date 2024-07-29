const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let validInput = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let solved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
let invalidInput = '1.5..2.84..63.12.7.2..5.g...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidLength = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'

suite('Functional Tests', function() {
    this.timeout(5000);
    test('Valid puzzle string', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: validInput
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.solution, solved)
                done();
            });
    });

    test('Missing puzzle string', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send()
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Required field missing')
                done();
            });
    });

    test('Invalid chars in puzzle string', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: invalidInput
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done();
            });
    });

    test('Invorrect length of puzzle string', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: invalidLength
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done();
            });
    });

    test('Puzzle cannot be solved', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: '..9..5.1.85.45...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done();
            });
    });

    test('Puzzle placement with all fields', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2',
                value: '4'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.valid, true)
                done();
            });
    });

    test('Puzzle placement with single conflict', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2',
                value: '5'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.valid, false)
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 1)
                done();
            });
    });

    test('Puzzle placement with multiple conflicts', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2',
                value: '7'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.valid, false)
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 2)
                done();
            });
    });

    test('Puzzle placement with all conflicts', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2',
                value: '2'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.valid, false)
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 3)
                done();
            });
    });

    test('Puzzle placement with missing required fields', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Required field(s) missing')
                done();
            });
    });

    test('Puzzle placement with invalid characters', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: invalidInput,
                coordinate: 'B2',
                value: '2'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done();
            });
    });

    test('Puzzle placement with incorrect length', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: invalidLength,
                coordinate: 'B2',
                value: '2'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done();
            });
    });

    test('Puzzle placement with invalid placement coordinate', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B!',
                value: '2'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Invalid coordinate')
                done();
            });
    });

    test('Puzzle placement with invalid placement value', function(done){
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validInput,
                coordinate: 'B2',
                value: '19'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'Invalid value')
                done();
            });
    });
});

