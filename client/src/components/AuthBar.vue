<template>
  <button @click="fish">Fish</button>
  <p>{{ authTextComp }}</p>
  <div>
    <button @click="handleAuthClick" v-if="isScriptsLoaded && !isLoggedIn">Authorize</button>
    <button @click="handleSignoutClick" v-if="isScriptsLoaded && isLoggedIn">Sign Out</button>
    <pre>{{ filesComp }}</pre>
  </div>
</template>

<script>
import api from '../services/api'
import { devUrl } from '../config'
import axios from 'axios'

const CLIENT_ID = '1090227126348-bekiom6rprjv0i3npohhroftrg2fnr0h.apps.googleusercontent.com'
const API_KEY = 'AIzaSyBMYClU3r3RLtTX7PLsWkYpBtOLMYAb644'
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'

export default {
  data() {
    return {
      authText: '',
      isLoggedIn: false,
      files: [],
      tokenClient: undefined,
      gapiInited: false,
      gisInited: false,
      content: "Запроса не было"
    }
  },
  computed: {
    isScriptsLoaded() {
      return this.gapiInited && this.gisInited
    },
    authTextComp() {
      return this.authText
    },
    filesComp() {
      return this.content
    },
  },
  methods: {
    async fish() {
      this.authText = await api.login()
    },
    async listFiles(accessToken) {
      console.log(accessToken)
      try {
        const response = await axios.get(`${devUrl}/api/files`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const files = response.data?.data

        if (!files || files.length === 0) {
          this.content = "No files found."
          return
        }
        console.log(files)
        const output = files.reduce(
          (str, file) => `${str}${file.name}(${file.id}) \n`,
          "Files:\n"
        )
        this.content = output
      } catch (err) {
        console.log('error', err)
        this.content = err.message
      }
    },
    handleAuthChange(token) {
      this.isLoggedIn = !!token
      if (token) {
        this.listFiles(token.access_token)
      } else {
        this.content = ""
      }
    },
    async handleAuthClick() {
      this.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp)
        }
        this.handleAuthChange(resp)
      }

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        console.log(this.tokenClient.requestAccessToken)
        this.tokenClient.requestAccessToken({ prompt: 'consent' })
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        this.tokenClient.requestAccessToken({ prompt: '' })
      }
    },
    async handleSignoutClick() {
      const token = gapi.client.getToken()
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token)
        gapi.client.setToken("")
        this.handleAuthChange(null)
      }
    },
    async initializeGapiClient() {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      })
      this.gapiInited = true
    },
    gapiLoaded(e) {
      console.log('yessss gapi')
      gapi.load('client', this.initializeGapiClient)
    },
    gisLoaded() {
      console.log('yessss gsi')
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '',
      })
      this.gisInited = true
      this.isLoggedIn = true
      this.maybeEnableButtons()
    },
    maybeEnableButtons() {
      if (gapi && this.tokenClient) {
        this.handleAuthChange(gapi.client?.getToken() || null)
      }
    },
    loadAndHandleScript(src, handle) {
      const script = document.createElement('script')
      script.src = src
      script.onload = (e) => {
        handle(e)
      }
      script.setAttribute("async", "")
      script.setAttribute("defer", "")
      document.head.appendChild(script)
    }
  },
  mounted() {
    this.loadAndHandleScript('https://apis.google.com/js/api.js', this.gapiLoaded)
    this.loadAndHandleScript('https://accounts.google.com/gsi/client', this.gisLoaded)
  }
}
</script>