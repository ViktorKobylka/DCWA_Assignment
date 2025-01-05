var express = require('express')
var mySqlDao = require('./mySqlDao')
var mongoDao = require('./mongoDao')
var app = express()

let ejs = require('ejs');
app.set('view engine', 'ejs')

const { check, validationResult } = require('express-validator')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

//start the server on port 3004
app.listen(3004, () => {
console.log("Server is listening")
})

//render home page
app.get('/', (req, res) => {
    res.render('home')
})

//get and display all students
app.get('/students', (req, res) => {
    mySqlDao.getStudents()//fetch all students from the database
    .then((data) => {
        res.render('students', { "students": data })//render students page with data
    })
    .catch((error) => {
        res.send(error)
    })
})

//render edit student page for a specific student
app.get('/students/edit/:sid', (req, res) => {
    mySqlDao.getStudentById(req.params.sid)//fetch student data by ID
        .then((data) => {
            res.render('editStudent', { student: data, errors: undefined })//render edit page with student data
        })
        .catch((error) => {
            res.send(error)
        })
})

//handle edit student form submission
app.post('/students/edit/:sid',
    [
        check("name").isLength({ min: 2 }).withMessage("Student Name should be at least 2 characters"),
        check("age").isInt({ min: 18 }).withMessage("Student Age should be at least 18")
    ],
    (req, res) => {
        const errors = validationResult(req)//check for errors

        if (!errors.isEmpty()) {
            mySqlDao.getStudentById(req.params.sid)//fetch student data for re-rendering form
            .then((data) => {
                res.render('editStudent', { student: data, errors: errors.errors })
            })
            .catch((error) => {
                res.send(error)
            });
        } else {
            const sid = req.params.sid
            const name = req.body.name
            const age = req.body.age
            mySqlDao.updateStudent(sid, name, age)//update student in the database
            .then(() => {
                res.redirect('/students')//redirect to students
            })
            .catch((error) => {
                res.send('Error: ' + error)
            })
            
        }
    }
)

//render the add student page
app.get('/students/add', (req, res) => {
    res.render('addStudent', { errors: undefined, student: {}})
   
})

//handle add student form submission
app.post('/students/add',
    [
        check("id").isLength({ min: 4, max: 4 }).withMessage("Student ID should be 4 characters"),
        check("name").isLength({ min: 2 }).withMessage("Student Name should be at least 2 characters"),
        check("age").isInt({ min: 18 }).withMessage("Student Age should be at least 18"),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        const sid = req.body.id
        const student = req.body
        const checkStudentID = await mySqlDao.checkStudent(sid)//check if student ID exists
        const checkStudentIDJSON = JSON.stringify(checkStudentID)//convert to JSON
        if (!errors.isEmpty()) {
            const student = req.body
            res.render('addStudent', { student: student, errors: errors.errors })
        } 
        else if(checkStudentIDJSON && checkStudentIDJSON !== '[]')
        {
            errors.errors.push({ msg: 'Student ID ' + sid + ' already exists' })
            res.render('addStudent', { student: student, errors: errors.errors })//re-render form with error
        }
        else {
            const name = req.body.name
            const age = req.body.age
            await mySqlDao.addStudent(sid, name, age)//add student to the database
            .then(() => {
                res.redirect('/students')//redirect to students
            })
            .catch((error) => {
                res.send('Error: ' + error)
            })
            
        }
    }
)

//display all grades
app.get('/grades', (req, res) => {
    mySqlDao.getGrades() //fetch all grades from the database
        .then((data) => {
            res.render('grades', { "grades": data }) 
        })
        .catch((error) => {
            res.send(error) 
        })
})

//display all lecturers
app.get('/lecturers', (req, res) => {
    mongoDao.findAll()
    .then((data) => {
         res.render('lecturers', { "lecturers": data })//render the lecturers page
    })
    .catch((error) => {
         res.send(error)
    })
})

//delete lecturer if no associated modules exist
app.get('/lecturers/delete/:lid', async (req, res) => {
    const lecturerId = req.params.lid

    try {
        const rows =  await mySqlDao.checkLecturer(lecturerId)//check if lecturer teaches any modules
        const rowsJSON = JSON.stringify(rows)
        const msg = 'Cannot delete Lecturer ' + lecturerId +'. He/She has associated modules'
        
       
        if (rowsJSON && rowsJSON !== '[]') {
            res.render('error', {message: msg})
        } else {
            await mongoDao.deleteLecturer(lecturerId) //delete lecturer from the database
            res.redirect('/lecturers')//redirect to lecturers 
        }
    } catch (error) {
        res.send(error)
    }
})


