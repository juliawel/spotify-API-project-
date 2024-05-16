const clientId = 'a97d53680b0c4da2862769a77dc8f369';
const redirectUri = 'http://127.0.0.1:5501/indexAPI.html'; 
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
  'user-read-recently-played'
];

document.getElementById('login-button').addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes.join('%20')}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;
});

window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  
  if (accessToken) {
    document.getElementById('login-button').style.display = 'none';
    fetchUserInfo(accessToken);
    document.getElementById('services').style.display = 'block';
    
    document.getElementById('get-playlists').addEventListener('click', () => fetchPlaylists(accessToken)); 
    document.getElementById('add-track').addEventListener('click', () => addTrackToPlaylist(accessToken)); 
    document.getElementById('update-playlist').addEventListener('click', () => updatePlaylistName(accessToken)); 
    document.getElementById('remove-track').addEventListener('click', () => removeTrackFromPlaylist(accessToken)); 
  }
});

function fetchUserInfo(accessToken) {
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('username').textContent = `Usuário: ${data.display_name}`;
    document.getElementById('user-email').textContent = `Email: ${data.email}`;
    if (data.images.length > 0) {
      document.getElementById('user-image').src = data.images[0].url;
    }
  })
  .catch(error => console.error('Erro ', error));
}

function fetchPlaylists(accessToken) {
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.items); 
    displayResults(data.items, 'Playlists');
  })
  .catch(error => console.error('Erro ', error));
}

function addTrackToPlaylist(accessToken) {
  const playlistId = prompt("Qual o ID da sua playlist? ");
  const trackUri = prompt("Qual o URI da música? ");

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [trackUri]
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.snapshot_id) {
      alert('Música adicionada. ');
    }
  })
  .catch(error => console.error('Erro ', error));
}

function updatePlaylistName(accessToken) {
  const playlistId = prompt("Qual o ID da sua playlist? "); 
  const newName = prompt("Qual o URI da música? ");

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newName
    })
  })
  .then(response => {
    if (response.status === 200) {
      alert('Nome atualizado. ');
    }
  })
  .catch(error => console.error('Erro ', error));
}

function removeTrackFromPlaylist(accessToken) {
  const playlistId = prompt("Qual o ID da sua playlist? "); 
  const trackUri = prompt("Qual o URI da música? "); 

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tracks: [{ uri: trackUri }]
    })
  })
  .then(response => {
    if (response.status === 200) {
      alert('Música removida.');
    }
  })
  .catch(error => console.error('Erro ', error));
}

function displayResults(items, type) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<h3>${type}</h3>`;
  items.forEach(item => {
    const p = document.createElement('p');
    p.textContent = item.name || item.track.name;
    resultsDiv.appendChild(p);
  });
}
