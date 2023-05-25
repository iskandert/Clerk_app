<template>
  <button @click="fish">Fish</button>
  <p>{{ authTextComp }}</p>
  <div>
    <button @click="handleAuthClick" v-if="isScriptsLoaded && !isLoggedIn">Authorize</button>
    <button @click="handleSignoutClick" v-if="isScriptsLoaded && isLoggedIn">Sign Out</button>
    <button @click="handleTest" v-if="isScriptsLoaded && isLoggedIn">Test</button>
    <div v-for="(name, i) in filesComp" :key="i">{{ name }}</div>
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

let gapi, google

export default {
  data() {
    return {
      authText: '',
      tokenClient: undefined,
      gapiInited: false,
      gisInited: false,
    }
  },
  computed: {
    isScriptsLoaded() {
      return this.gapiInited && this.gisInited
    },
    authTextComp() {
      return this.authText
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    filesComp() {
      const files = this.$store.getters.getDataList('files')

      if (!files || files.length === 0) {
        return ["No files found."]
      }
      console.log(files)
      return ['Files:', ...files.map((file) => `${file.name} (${file.id})`)]
    },
  },
  methods: {
    async fish() {
      this.authText = await api.login()
    },
    async handleAuthClick() {
      this.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp)
        }
        this.$store.commit('SET_TOKEN', resp.access_token)
        // this.handleAuthChange(resp)
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
      const token = this.isLoggedIn
      if (token !== null) {
        console.log('sign out');
        google.accounts.oauth2.revoke(token)
        gapi.client.setToken("")
        this.$store.commit('RESET')
      }
    },
    async handleTest() {
      api.getData({ col: 'test' })
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
      gapi = window.gapi
      gapi.load('client', this.initializeGapiClient)
    },
    gisLoaded() {
      console.log('yessss gsi')
      google = window.google
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '',
      })
      this.gisInited = true
      //   if (gapi && this.tokenClient) {
      //     this.handleAuthChange(gapi.client?.getToken() || null)
      //   }
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
  watch: {
    isLoggedIn: {
      async handler(nv) {
        if (nv) {
          try {
            await this.$store.dispatch('setFiles')
          } catch (err) {
            console.log('error', err)
          }
        }
      }
    }
  },
  mounted() {
    this.loadAndHandleScript('https://apis.google.com/js/api.js', this.gapiLoaded)
    this.loadAndHandleScript('https://accounts.google.com/gsi/client', this.gisLoaded)
  }
}
</script>