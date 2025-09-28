import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  } 

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: 
            <input
            data-testid='titleInput'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Title of new blog"
          />
        </div>
        <div>
          Author: 
            <input
            data-testid='authorInput'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Author of new blog"
          />
        </div>
        <div>
          URL: 
            <input
            data-testid='urlInput'
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="URL of new blog"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm