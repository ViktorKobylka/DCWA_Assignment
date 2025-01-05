var pmysql = require('promise-mysql')
var pool

//create a connection pool for the MySQL database
pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then((p) => {
        pool = p
        console.log("Connected to MySql database")
    })
    .catch(e => {
        console.log("pool error:" + e)
})
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'; to fix issues with myysql support authentication protocol

//retrieve all grades including student and module details
var getGrades = function () {
    return new Promise((resolve, reject) => {
        const query = "SELECT s.name AS student_name,m.name AS module_name, g.grade FROM student s LEFT JOIN grade g ON s.sid = g.sid LEFT JOIN module m ON g.mid = m.mid ORDER BY s.name ASC, g.grade ASC;"
        pool.query(query)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//retrieve all students
var getStudents = function () {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM student ORDER BY sid ASC;"
        pool.query(query)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//retrieve specific student by ID
var getStudentById = async function (sid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM student WHERE sid LIKE '" + sid + "';"
        pool.query(query)
            .then((data) => {
                resolve(data) 
            })
            .catch((error) => {
                reject(error) 
            })
    })
}

//update student details in the database
var updateStudent = function (sid, name, age) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE student SET name = '" + name + "', age = '"+ age+"' WHERE sid ='" + sid + "';"
        pool.query(query)
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//add new student to the database
var addStudent = function (sid, name, age) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO student (sid, name, age) VALUES ('" + sid + "', '" + name + "', '" + age + "');"
        pool.query(query)
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//check if lecturer is associated with any modules
var checkLecturer = function (lecturerId) {
    return new Promise((resolve, reject) => {
        const query = "select * FROM module WHERE lecturer = '" + lecturerId + "';"
        pool.query(query)
        .then(([rows]) => {
            resolve(rows)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

//check if student exists in the database
var checkStudent = function (sid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM student WHERE sid = '" + sid +"';"
        pool.query(query)
            .then(([data]) => {
                resolve(data) 
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//export all functions
module.exports = {getGrades, getStudents, getStudentById, updateStudent, addStudent, checkLecturer, checkStudent}

