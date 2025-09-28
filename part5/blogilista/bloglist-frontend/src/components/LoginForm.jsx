import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const LoginForm = ({ setUser, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('Wrong username or password'), false
    }
  }
  
  return (
    <>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            data-testid='usernameInput'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            data-testid='passwordInput'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
}

export default LoginForm