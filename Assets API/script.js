const clientId = 'ac1b21d332e44888a1d7f4f1b15eb060';
const redirectUri = 'http://localhost:5500/index.html'; // Atualize esta URI
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
    fetchUserInfo(accessToken); // Serviço GET: Obter informações do usuário
    document.getElementById('services').style.display = 'block';
    
    document.getElementById('get-playlists').addEventListener('click', () => fetchPlaylists(accessToken)); // Serviço GET: Obter playlists do usuário
    document.getElementById('add-track').addEventListener('click', () => addTrackToPlaylist(accessToken)); // Serviço POST: Adicionar faixa à playlist
    document.getElementById('update-playlist').addEventListener('click', () => updatePlaylistName(accessToken)); // Serviço PUT: Atualizar nome da playlist
    document.getElementById('remove-track').addEventListener('click', () => removeTrackFromPlaylist(accessToken)); // Serviço DELETE: Remover faixa da playlist
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
    document.getElementById('username').textContent = `Username: ${data.display_name}`;
    document.getElementById('user-email').textContent = `Email: ${data.email}`;
    if (data.images.length > 0) {
      document.getElementById('user-image').src = data.images[0].url;
    }
  })
  .catch(error => console.error('Error fetching user info:', error));
}

function fetchPlaylists(accessToken) {
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.items); // Aqui você encontra o ID das suas playlists
    displayResults(data.items, 'Playlists');
  })
  .catch(error => console.error('Error fetching playlists:', error));
}

function addTrackToPlaylist(accessToken) {
  const playlistId = prompt("Enter your playlist ID"); // Solicita o ID da playlist ao usuário
  const trackUri = prompt("Enter the track URI"); // Solicita o URI da faixa ao usuário

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
      alert('Track added to playlist successfully!');
    }
  })
  .catch(error => console.error('Error adding track to playlist:', error));
}

function updatePlaylistName(accessToken) {
  const playlistId = prompt("Enter your playlist ID"); // Solicita o ID da playlist ao usuário
  const newName = prompt("Enter the new playlist name"); // Solicita o novo nome da playlist ao usuário

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
      alert('Playlist name updated successfully!');
    }
  })
  .catch(error => console.error('Error updating playlist name:', error));
}

function removeTrackFromPlaylist(accessToken) {
  const playlistId = prompt("Enter your playlist ID"); // Solicita o ID da playlist ao usuário
  const trackUri = prompt("Enter the track URI to remove"); // Solicita o URI da faixa ao usuário

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
      alert('Track removed from playlist successfully!');
    }
  })
  .catch(error => console.error('Error removing track from playlist:', error));
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
