import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SpotifyButton from './SpotifyButton';

function AppNavbar({ spotifyToken, updateSpotifyToken }) {
    return (
        <Navbar bg='dark' data-bs-theme='dark'>
            <Container fluid>
                <Navbar.Brand href='/'>Spotify Playlist Generator</Navbar.Brand>
                <Navbar.Collapse className='justify-content-end'>
                    <SpotifyButton spotifyToken={spotifyToken} updateSpotifyToken={updateSpotifyToken} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar