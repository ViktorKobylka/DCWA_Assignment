var express = require('express')
var mySqlDao = require('./mySqlDao')
var app = express();

let ejs = require('ejs');
app.set('view engine', 'ejs')

app.listen(3004, () => {
console.log("Server is listening")
})

app.get('/', (req, res) => {
    res.render('home'); 
});


app.get('/students', (req, res) => {
    mySqlDao.getStudents()
    .then((data) => {
        res.render('students', { "students": data }); 
    })
    .catch((error) => {
        res.send(error); 
    }); 
});


app.get('/grades', (req, res) => {
    mySqlDao.getGrades()
        .then((data) => {
            res.render('grades', { "grades": data }); 
        })
        .catch((error) => {
            res.send(error); 
        }); 
});


app.get('/lecturers', (req, res) => {
     
});
