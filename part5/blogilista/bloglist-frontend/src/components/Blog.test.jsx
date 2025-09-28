import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let likeBlog
  let deleteBlog
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

  const user = {
    username: 'testuser',
    name: 'John Doe'
  }

  beforeEach(() => {
    likeBlog = vi.fn()
    deleteBlog = vi.fn()
    render(
      <Blog 
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        user={user}
      />
    )
  })
  test('Renders initial blog information', () => {
    const title = screen.queryByText(`${blog.title} ${blog.author}`)
    const url = screen.queryByText(`${blog.url}`)
    expect(title).toBeDefined()
    expect(url).toBeNull()
  })
  test('Renders expanded blog information when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const title = screen.queryByText(`${blog.title} ${blog.author}`)
    const url = screen.queryByText(`${blog.url}`)
    expect(title).toBeDefined()
    expect(url).toBeDefined()
  })
  test('Like handler is used when like button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})