const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'johndoe',
        name: 'John Doe',
        password: 'password'
      }
    })
    page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in')).toBeVisible()
    await expect(page.getByTestId('usernameInput')).toBeVisible()
    await expect(page.getByTestId('passwordInput')).toBeVisible()
  })

  test('Login succeeds with valid credentials', async ({ page }) => {
    await loginWith( page, 'johndoe', 'password' )
    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
    await expect(page.getByText(/logged in/)).toBeVisible()
  })

  test('Login fails with invalid credentials', async ({ page }) => {
    await loginWith( page, 'johndoe', 'wrongpassword' )
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong username or password')
    await expect(page.getByText(/logged in/)).not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'johndoe', 'password')
      await createBlog(page, 'new blog', 'playwright', 'https://example.com/blog')
    })

    test('A new blog can be created', async ({ page }) => {
      await createBlog(page, 'new blog', 'playwright', 'https://example.com/blog')
      await expect(page.getByText('new blog playwright')).toBeVisible()
    })

    test('A blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Show' }).click()
      await page.getByRole('button', { name: 'Like' }).click()
      await page.getByText(/Likes 1/).waitFor()
      await expect(page.getByText('Likes 1')).toBeVisible()
    })

    test('A blog can be deleted', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'Show' }).click()
      await page.getByRole('button', { name: 'Remove' }).click()
      await expect(page.getByText('new blog playwright')).not.toBeVisible()
    })

    test('Only the owner of a blog can see remove button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          username: 'janedoe',
          name: 'Jane Doe',
          password: '12345678'
        }
      })
      await page.getByRole('button', { name: 'Log out' }).click()
      await loginWith(page, 'janedoe', '12345678')
      await page.getByRole('button', { name: 'Show' }).click()
      await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
    })

    test('Blogs are sorted by likes', async ({ page }) => {
      await createBlog(page, 'new blog 2', 'playwright', 'https://example.com/blog2')

      await page.getByRole('button', { name: 'Show' }).first().click()
      await page.getByRole('button', { name: 'Show' }).last().click()
      await page.getByRole('button', { name: 'Like' }).last().click()
      await page.getByText(/Likes 1/).waitFor()

      const likesAtStart = await page.getByTestId('likes').all()
      expect(await likesAtStart[0].textContent()).toContain('0')
      expect(await likesAtStart[1].textContent()).toContain('1')

      await page.reload()

      await page.getByRole('button', { name: 'Show' }).first().click()
      await page.getByRole('button', { name: 'Show' }).last().click()

      const likesAtEnd = await page.getByTestId('likes').all()

      expect(await likesAtEnd[0].textContent()).toContain('1')
      expect(await likesAtEnd[1].textContent()).toContain('0')
    })
  })
})