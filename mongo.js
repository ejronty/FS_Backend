const mongoose = require('mongoose')

const url = 'mongodb://<username>:<pwd>@ds133558.mlab.com:33558/elmo-fs'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length <= 3) {
  Person
  .find({})
  .then(result => {
    console.log('Puhelinluettelo:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`Lisätään henkilö ${person.name}, numero ${person.number} luetteloon.`)
      mongoose.connection.close()
    })
}
