import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: formData.username,
        password: formData.password
      })

      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Login failed. Please check your credentials.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Login / Sign In</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-link">
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  )
}

export default Login
