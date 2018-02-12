const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', function getReqBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


const formatPersons = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/', (req, res) => {
  res.send('<h1>Etusivu</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPersons))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPersons(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({error: 'malformatted id'})
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot.</p> <p>${Date()}</p>`)
    })

})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({error: 'malformatted id'})
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined || body.name === "" || body.number === "") {
    return res.status(400).json({error: 'Missing name or number'})
  } 

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(formatPersons(savedPerson))
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  console.log(body)

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(formatPersons(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({error: 'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})