import './App.css';
import AppNavbar from './AppNavbar';
import CallbackPage from './CallbackPage';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import History from './History';
import { useCookies } from 'react-cookie';

class SpotifyUser {
  // TODO: Change these fields to match the Spotify API (just copy the JSON response)
  name;
  id;
  iconUrl;
  constructor(token, expiresAt) {
    this.token = token;
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

function App() {

  const [spotifyUser, setSpotifyUser] = useState(null);
  const [cookie,] = useCookies(['spotifyUser']);

  useEffect(() => {
    if (cookie.spotifyUser) {
      if (cookie.spotifyUser.expiresAt < Date.now()) {
        setSpotifyUser(null);
        cookie.remove('spotifyUser');
      }
      else {
        setSpotifyUser(cookie.spotifyUser);
      }
    }
  });

  const updateSpotifyUser = (user) => {
    setSpotifyUser(user);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <AppNavbar spotifyUser={spotifyUser} updateSpotifyUser={updateSpotifyUser} />
        <Routes>
          <Route path='/' element={<Home spotifyUser={spotifyUser} updateSpotifyUser={updateSpotifyUser} />} />
          <Route path='/callback' element={<CallbackPage updateSpotifyUser={updateSpotifyUser} />} />
          <Route path='/history' element={<History spotifyUser={spotifyUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { SpotifyUser as SpotifyToken };
export default App;
