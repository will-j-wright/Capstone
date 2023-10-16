import './App.css';
import AppNavbar from './AppNavbar';
import CallbackPage from './CallbackPage';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { SpotifyUser as SpotifyToken };
export default App;
