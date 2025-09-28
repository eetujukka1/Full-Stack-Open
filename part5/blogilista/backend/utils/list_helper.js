const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map((blog) => blog.likes).reduce((accumulator, likes) => accumulator + likes, 0,)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  blogs.reduce((accumulator, blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
    }
  }, 0)
  return blogs.find((blog) => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const authors = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({
      name: key,
      blogs: value.length
    }))
    .value()

  return _.maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
  const authors = _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({
      name: key,
      likes: value
        .reduce((accumulator, blog) => {
          return accumulator + blog.likes
        }, 0,)
    }))
    .value()

  return _.maxBy(authors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}