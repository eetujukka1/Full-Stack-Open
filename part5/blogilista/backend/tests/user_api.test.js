const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('Account creation', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ej04',
        name: 'Eetu Jukka',
        password: 'tosisalainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test('creation fails with proper statuscode and message if username or password missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'aaaaaa',
        name: 'Superuser',
      }

      const newUser2 = {
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const result2 = await api
        .post('/api/users')
        .send(newUser2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('missing username or password') && result2.body.error.includes('missing username or password'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username or password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'a',
        password: 'salainen',
      }

      const newUser2 = {
        username: 'aaaaa',
        password: 's',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const result2 = await api
        .post('/api/users')
        .send(newUser2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert(result.body.error.includes('User validation failed') && result2.body.error.includes('password must be 3 or more characters'))
    })
  })

  describe('Login', () => {
    test('login succeeds with valid credentials', async () => {
      const user = {
        username: 'thiswillwork',
        password: 'yesitwill'
      }

      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/login')
        .send({
          username: user.username,
          password: user.password,
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('login fails with invalid credentials', async () => {
      const user = {
        username: 'thiswontwork',
        password: 'nope'
      }

      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/login')
        .send({ username: 'didntwork', password: 'itdidnot' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/login')
        .send({ username: user.username, password: 'itdidnot' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/login')
        .send({ username: user.username })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      await api
        .post('/api/login')
        .send({ password: user.password })
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})