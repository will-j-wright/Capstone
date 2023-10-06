import './App.css';
import AppNavbar from './AppNavbar';
import CallbackPage from './CallbackPage';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

class SpotifyToken {
  constructor(token, expiresAt) {
    this.token = token;
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }
}

function App() {

  const [spotifyToken, setSpotifyToken] = useState(null);

  const updateSpotifyToken = (token) => {
    setSpotifyToken(token);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <AppNavbar spotifyToken={spotifyToken} updateSpotifyToken={updateSpotifyToken} />
        <Routes>
          <Route path='/' element={<h1>Home</h1>} />
          <Route path='/callback' element={<CallbackPage updateSpotifyToken={updateSpotifyToken} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { SpotifyToken };
export default App;
