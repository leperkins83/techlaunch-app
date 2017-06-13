const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fvi_quiz_app'
});

connection.connect();

app.use(bodyParser.json());

app.get('/allquestions', function(req, res){
    connection.query('SELECT * from medical_questions',
    function(err, rows){
        if(err){
            return res.status(500).json({database_error: err});
        }
        res.json(rows);
    });
});

//this route will require a req.body containing the following:
//questionText
//answers: [
//{answerText: 'string', correct: boolean},
//{answerText: 'string', correct: boolean},
//{answerText: 'string', correct: boolean}
//]

// {questionText: "who u b"
// answers: [
//     {answerText: '', correct: true}
//     {answerText: '', co}
//     {answerText: ''}
//     {answerText: ''}
// ]
// }

// 'who u b': {
//     answers:
//     {},
//     {}
// }

app.get('/generatequiz', function (req, res){
    const query = `
    SELECT medical_questions.question, answer_text, correct
    from medical_questions
    JOIN medical_question_answers
    on medical_questions.id = medical_question_answers.question_id`;
    connection.query(query, function(err, result){
        if(err){
            console.log("Error selecting from db "+err.toString());
            return res.status(500).json({error: error});
        }
        let clientResponse = {};
        result.forEach(function(dbRow, idx){
            if (!clientResponse[dbRow.question]){
                clientResponse[dbRow.question] = {answers: []};
            }
            clientResponse[dbRow.question].answers.push({
                answerText: dbRow.answer_text,
                correct: dbRow.correct
            });
        });
        res.json(clientResponse);
    });
});


app.post('/createquestion', function(req, res){
    var newQuestionText = req.body.questionText;
    connection.query('INSERT INTO medical_questions(question) values (${newQuestionText})',
function(err, result){
    if(err){
        res.status(500).json({database_error: err});
        return;
    }

    var values = '';
    for(var i = 0; i < req.body.answers.length; i++){
        values += "("+ result.insertId+ ", '"+
        req.body.answers[i].answerText +"', "+
        req.body.answers[i].correct +"),"
    }
    values = values.substring(0, values.length-1);
    connection.query(`
        INSERT INTO medical_question_answers
        (question_id, answer_text, correct)
        VALUES` + values, function(err2, result2){
        if(err2){
            res.status(500).json({database_error: err2});
            return;
        }
        res.json({result1: result, result2: result2});
    })
});
});

//fetch('http://url', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({questionText: 'what does it have in its pocketes?'})})

// BELOW WAS THE START DUMMY question
// app.get('/getrandomquestion', function(req, res){
//
//     res.json({
//         question: 'What is love?',
//             answers: [
//                 'baby dont hurt me',
//                 'dont hurt me',
//                 'no more',
//                 'a marketing ploy'
//             ],
//             correctAnswer: 'a martketing ploy'
//         });
// });

var adminHtmlFile = fs.readFileSync(__dirname + '/admin.views/admin.html')
app.get('/admin', function(req, res){
    res.end(adminHtmlFile);
});


app.listen(1400, function(){
    console.log("Server listening...")
});
