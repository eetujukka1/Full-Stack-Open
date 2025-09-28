const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are blogs beforehand', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog has id property', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual('id' in response.body[0], true)
  })

  describe('adding a blog', () => {
    test('blogs can be added with valid token', async () => {
      const token = await helper.generateToken()
      const newBlog = {
        title: 'Example blog',
        author: 'John Doe',
        url: 'https://example.com/example3',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes('Example blog'))
    })

    test('likes become 0 if no likes provided', async () => {
      const token = await helper.generateToken()
      const newBlog = {
        title: 'Example blog',
        author: 'John Doe',
        url: 'https://example.com/example3',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const likes = blogsAtEnd.map(blog => blog.likes)
      assert(likes.includes(0))
    })

    test('fails with error code 401 if token is invalid', async () => {
      let token = await helper.generateToken()
      token = token[0] + 'a' + token.slice(2)
      const newBlog = {
        title: 'Toilet paper is the new gold',
        author: 'Jane Doe',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)
    })

    test('fails with error code 400 if title is missing', async () => {
      const token = await helper.generateToken()
      const newBlog = {
        author: 'Jane Doe',
        url: 'https://example.com/example4'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with error code 400 if url is missing', async () => {
      const token = await helper.generateToken()
      const newBlog = {
        title: 'Toilet paper is the new gold',
        author: 'Jane Doe',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with a valid token', async () => {
      const token = await helper.generateToken()
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const blog = new Blog ({
        title: 'Will remove soon',
        author: 'Akkuj U.',
        url: 'https://example.com/example22',
        likes: 32,
        user: decodedToken.id
      })

      const savedBlog = await blog.save()

      console.log(savedBlog._id.toString())

      await api
        .delete(`/api/blogs/${savedBlog._id.toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)

      assert(!titles.includes(blog.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with an invalid token', async () => {
      let token = await helper.generateToken()
      token = token[0] + '2' + token.slice(2)
      const blogsAtStart = await helper.blogsInDb()
      const blogToBeDeleted = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToBeDeleted.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(map => map.title)

      assert(titles.includes(blogToBeDeleted.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToBeUpdated = blogsAtStart[0]

      const changedBlog = {
        ...blogToBeUpdated,
        author: 'Some other author',
        likes: 56,
      }

      await api
        .put(`/api/blogs/${blogToBeUpdated.id}`)
        .send(changedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const authors = blogsAtEnd.map(blog => blog.author)

      assert(authors.includes('Some other author'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})