var pmysql = require('promise-mysql')
var pool

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

var getGrades = function () {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                s.name AS student_name,
                m.name AS module_name,
                g.grade
            FROM 
                student s
            LEFT JOIN 
                grade g ON s.sid = g.sid
            LEFT JOIN 
                module m ON g.mid = m.mid
            ORDER BY 
                s.name ASC, g.grade ASC;
        `

        pool.query(query)
            .then((data) => {
                resolve(data); 
            })
            .catch((error) => {
                reject(error); 
            })
    })
}

var getStudents = function () {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM student 
            ORDER BY sid ASC;
        `
        pool.query(query)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

module.exports = {getGrades, getStudents}
