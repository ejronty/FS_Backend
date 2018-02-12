const mongoose = require('mongoose')

const url = 'mongodb://<username>:<pwd>@ds133558.mlab.com:33558/elmo-fs'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person