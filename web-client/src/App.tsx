import React, { useEffect, useState } from 'react';
import api from './services/api';

import './global.css'
import './App.css'
import './Sidebar.css'
import './Main.css'

const App: React.FC = () => {
  interface IUser {
    name: string,
    _id: number,
    avatarUrl?: string,
    githubUsername?: string,
    techs?: string[],
    bio?: string
  }

  const [users, setUsers] = useState<IUser[]>([])

  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords

      setLatitude(latitude.toString());
      setLongitude(longitude.toString());
    },
    (err) => {
      console.log(err)
    }, {
      timeout: 30000
    }
    )
  }, [])

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/users')
      setUsers(response.data)
    }

    loadUsers()
  }, [])

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const response = await api.post(`/users`, {
      githubUsername: github_username,
      techs,
      latitude,
      longitude
    })

   setGithubUsername('');
   setTechs('');
   setUsers([...users, response.data])
  }

  return (
    <div id="app">
      <aside>
        <strong>Register</strong>
        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="github_username">Github User</label>
            <input name="github_username" id="github_username" value={github_username} onChange={e => setGithubUsername(e.target.value)} required />

            <label htmlFor="techs">Technologies</label>
            <input name="techs" id="techs" value={techs} onChange={e => setTechs(e.target.value)} required />

            <div className="input-group">
              <div className="input-block">
                <label htmlFor="latitude">Latitude</label>
                <input type="number" name="latitude" id="latitude" value={latitude} onChange={e => setLatitude(e.target.value)} required />
              </div>
              <div className="input-block">
                <label htmlFor="Longitude">Longitude</label>
                <input type="number" name="Longitude" id="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required /> 
                
              </div>
            </div>
          </div>

          <button type="submit">Save</button>
        </form>
      </aside>
      
      <main>
        <ul>
        {users.map(user => (
            <li className="dev-item" key={user._id}>
                <header>
                  <img src={user.avatarUrl} alt={user.name}/>
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <span>{user.techs}</span>
                  </div>
                </header>
                <p>{user.bio}</p>
                <a href={`https://github.com/${user.githubUsername}`}>Github Profile</a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
