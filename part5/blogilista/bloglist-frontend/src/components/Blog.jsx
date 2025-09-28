import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [expandedView, setExpandedView] = useState(false)

  const toggleExpandedView = () => {
    setExpandedView(!expandedView)
  }

  const handleLike = (event) => {
    event.preventDefault()
    likeBlog(blog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    deleteBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div> 
        {blog.title} {blog.author}
        {!expandedView && <button onClick={toggleExpandedView}>Show</button>} 
        {expandedView && <>
          <button onClick={toggleExpandedView}>Hide</button>
          <div>{blog.url}</div>
          <div data-testid='likes'>
            Likes {blog.likes}
            <button onClick={handleLike}>Like</button>  
          </div>
          <div>{blog.user.name}</div>
          <div>
            {user.username === blog.user.username && <button onClick={handleRemove}>Remove</button>}
          </div>
        </>}
      </div>
      
  </div>
)}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog