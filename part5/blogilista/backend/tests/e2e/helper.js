const loginWith = async (page, username, password) => {
  await page.getByTestId('usernameInput').fill(username)
  await page.getByTestId('passwordInput').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByTestId('titleInput').fill(title)
  await page.getByTestId('authorInput').fill(author)
  await page.getByTestId('urlInput').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

module.exports = {
  loginWith,
  createBlog
}