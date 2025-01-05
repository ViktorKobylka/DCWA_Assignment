const MongoClient = require('mongodb').MongoClient

var db
var coll

//connect to the MongoDB server
MongoClient.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
    db = client.db('proj2024MongoDB')
    coll = db.collection('lecturers')
    console.log("Connected to MongoDB database")
    })
    .catch((error) => {
    console.log(error.message)
})

//retrieve all documents from the lecturers collection
var findAll = function() {
    return new Promise((resolve, reject) => {
    var cursor = coll.find().sort({ _id: 1 })
    cursor.toArray()
    .then((documents) => {
        resolve(documents)
    })
    .catch((error) => {
        reject(error)
    })
})
}

//delete a lecturer document by ID
var deleteLecturer = function(lecturerId) {
    return new Promise((resolve, reject) => {
        coll.deleteOne({ _id: lecturerId })
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//export the functions
module.exports = { findAll, deleteLecturer}

