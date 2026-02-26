import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:5000'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    fetchProfile(token)
  }, [navigate])

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching profile:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.username}!</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
      <p><strong>User ID:</strong> {user?.id}</p>
      
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  )
}

export default Dashboard
