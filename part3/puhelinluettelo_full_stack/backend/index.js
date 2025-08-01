const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-532532"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const html = `
    <!DOCTYPE html>
    <html>
        <body>
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date().toUTCString()}</div>
        </body>
    </html>
    `
    response.send(html)
})

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: "name or number missing"})
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(409).json({error: "name must be unique"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000).toString()
    }

    persons = persons.concat(person)

    response.status(201).json(person)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})