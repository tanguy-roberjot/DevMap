import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import './styles.css';

function DevForm({ onSubmit }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [techs, setTechs] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude); 
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  },[]);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);

    try{
      const response = await api.post('/devs', {
        github_username: githubUsername,
        techs,
        latitude,
        longitude,
      });

      console.log(response.data);

      setGithubUsername('');
      setTechs('');

      onSubmit(response.data);
    } catch(err) {
      alert('Error creating Dev account');
    }
    setLoading(false);
  }

  return(
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Github username</label>
        <input 
          name="github_username" 
          id="github_username" 
          required 
          value={githubUsername}
          onChange={e=> setGithubUsername(e.target.value)}
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Techs</label>
        <input 
          name="techs" 
          id="techs" 
          required
          value={techs}
          onChange={e => setTechs(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input 
            type="number" 
            name="latitude" 
            id="latitude" 
            required 
            value={latitude}
            onChange={e => setLatitude(e.target.value)} 
          />
        </div>

        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input 
            type="number" 
            name="longitude" 
            id="longitude" 
            required 
            value={longitude} 
            onChange={e => setLongitude(e.target.value)}
          />
        </div>
      </div>

      <button type="submit">
        {loading ? 
          <FaSpinner className="icon-spin" size={18} color="#fff"/>
          : 'Create'
        }
      </button>
    </form>
  )
}

export default DevForm;