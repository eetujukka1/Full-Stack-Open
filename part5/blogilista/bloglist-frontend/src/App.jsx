import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageValue, setMessageValue] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      let blogs = await blogService.getAll()
      blogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }

    fetchData()
      .catch(console.error)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = ( message, success ) => {
    setMessageValue(
      success
    )
    setMessage(
      message
    )
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }
  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      let returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = {
        username: user.username,
        name: user.name,
        id: returnedBlog.user.id
      }
      setBlogs(blogs.concat(returnedBlog))
      notify(`New blog added: ${returnedBlog.title} by ${returnedBlog.author}`, true)
    } catch (exception) {
      notify('Missing title or URL.', false)
    }
  }

  const likeBlog = async (blogObject) => {
    const likes = blogObject.likes + 1
    const likedBlog = {
      ...blogObject,
      likes: likes
    }
    try {
      const returnedBlog = await blogService.update(likedBlog)
      const blogIndex = blogs.findIndex(blog => blog.id === returnedBlog.id)
      const blogsCopy = [...blogs]
      blogsCopy[blogIndex].likes = returnedBlog.likes
      setBlogs(blogsCopy)
    } catch (exception) {
      notify('Could not like blog. Try again later.', false)
    }
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title}`)) {
      try {
        await blogService.remove(blogObject)
        const blogIndex = blogs.findIndex(blog => blog.id === blogObject.id)
        let blogsCopy = [...blogs]
        blogsCopy.splice(blogIndex, 1)
        setBlogs(blogsCopy)
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  return (
    <div>
      <Notification message={message} value={messageValue} />
      {!user && <LoginForm 
        setUser={setUser}
        notify={notify}
      />} 
      {user && <div>
        <h2>Blogs</h2>
        <div>
          {user.name} logged in
          <button onClick={handleLogout}>Log out</button>
        </div>
        <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App