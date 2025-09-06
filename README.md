# Spotify API Project

This is a simple web application that demonstrates how to use the Spotify Web API to manage a user's playlists.

## Features

*   Log in with your Spotify account.
*   View your user information.
*   View your playlists.
*   Add a track to a playlist.
*   Update a playlist's name.
*   Remove a track from a playlist.

## How to Run

1.  **Create a Spotify Application:**
    *   Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and create a new application.
    *   Note your **Client ID**.
    *   In the application settings, add a **Redirect URI**. For this project, the default is `http://127.0.0.1:5501/indexAPI.html`.

2.  **Configure the project:**
    *   Open `Assets API/script.js`.
    *   Update the `clientId` variable with your Spotify application's Client ID.
    *   Update the `redirectUri` variable if you used a different Redirect URI in the Spotify application settings.

3.  **Run the application:**
    *   Open `indexAPI.html` in your web browser.

## How it Works

The application uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to interact with a user's Spotify account. The authentication is done using the [Implicit Grant Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow).

When you click the "Log in with Spotify" button, you are redirected to the Spotify authorization page. After you grant permission, you are redirected back to the application with an access token in the URL. The application then uses this access token to make requests to the Spotify API.
