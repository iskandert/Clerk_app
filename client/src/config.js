const devUrl = import.meta.env.VITE_SERVER_URL
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const API_KEY = import.meta.env.VITE_API_KEY

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
const SCOPES = ['https://www.googleapis.com/auth/drive.appdata'].join(' ')

export { devUrl, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES }
