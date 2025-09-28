const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Express 101',
    author: 'Eetu J.',
    url: 'https://example.com/example1',
    likes: 12,
  },
  {
    title: 'Why Dune is a great franchise and you should definitely watch the movies',
    author: 'Akkuj U.',
    url: 'https://example.com/example2',
    likes: 32,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const generateToken = async () => {
  const username= 'BlogEditor'
  const password= 'todellasalainen'

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash
  })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  return token
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  generateToken
}