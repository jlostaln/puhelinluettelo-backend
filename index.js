const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// esimerkki morganin dokumentaatiosta: morgan.token('type', function (req, res) { return req.headers['content-type'] })
// toimii myös nuolifunkiolla
morgan.token('body', (request, response) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // console.log(id)
  const person = persons.find(person => person.id == id)
  // console.log(person)

  if (person) {
    response.send(person)
  } else {
    response.status(404).end()
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/info', (request, response) => {
  const num = persons.length
  const time = Date()
  response.send(
    `<div>Phonebook has info for ${num} people</div>
    <br>
    <div>${time}</div>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random()*100000)
  return newId
}

app.post('/api/persons', (request, response) => {
  
  const body = request.body
  // console.log(body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  // console.log(person)
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})





