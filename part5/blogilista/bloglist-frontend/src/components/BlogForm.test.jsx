import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let createBlog
  beforeEach(() => {
    createBlog = vi.fn()
    render(
      <BlogForm 
        createBlog={createBlog}
      />
    )
  })
  test('createBlog is called with corred data when blog is created', async () => {
    const blog = {
      title: 'Test blog',
      author: 'John Doe',
      url: 'example.com',
      likes: 3,
      user: {
        username: 'testuser',
        name: 'John Doe'
      }
    }

    const user = userEvent.setup()
    const titleInput = screen.getByPlaceholderText('Title of new blog')
    const authorInput = screen.getByPlaceholderText('Author of new blog')
    const urlInput = screen.getByPlaceholderText('URL of new blog')
    const button = screen.getByText('Create')
    await user.type(titleInput, 'Testing')
    await user.type(authorInput, 'John Doe')
    await user.type(urlInput, 'example.com/testing')
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    const mockCall = createBlog.mock.calls[0][0]
    console.log(mockCall)
    expect(mockCall.title === blog.title && mockCall.author === blog.author && mockCall.url === blog.url)
  })
})