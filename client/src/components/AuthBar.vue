<template>
  <div>
    <button @click="handleAuthClick" v-if="isScriptsLoaded && !isLoggedIn">
      Authorize
    </button>
    <button @click="handleSignoutClick" v-if="isScriptsLoaded && isLoggedIn">
      Sign Out
    </button>
    <div v-if="isLoggedIn">
      <button @click="getMeta">Get Files Meta</button>
      <button @click="deleteAllData">Delete App Data</button>
      <button @click="getAllData">Init & Get All Data</button>
    </div>
    <pre>{{ filesComp }}</pre>
  </div>
</template>

<script>
import api from '../services/api'
import store from '../store'
import { API_KEY, CLIENT_ID, DISCOVERY_DOC, SCOPES } from '../config'
import {
  watchTokenExpiring
} from '../composables/watchers'
import { v4 as uuidv4 } from 'uuid'

let gapi, google

export default {
  setup() {

    store.dispatch('setTokenExpiring')
    watchTokenExpiring()
  },
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
      return this.$store.getters.getList('all')
    },
  },
  methods: {
    async handleAuthClick() {
      this.tokenClient.callback = async (resp) => {
        console.log('tokenClient.callback');
        if (resp.error !== undefined) {
          throw (resp)
        }
        console.log(resp);
        console.log(this.tokenClient);
        this.$store.dispatch('login', {
          //
          token: resp.access_token,
          saved_in: this.$dayjs(),
          expires_in: resp.expires_in
        })
      }

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        this.tokenClient.requestAccessToken({ prompt: 'consent' })
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        this.tokenClient.requestAccessToken({ prompt: '' })
      }
    },
    async handleSignoutClick() {
      if (!this.isLoggedIn) return
      this.$store.dispatch('logout')
    },

    // ----------- handling of google scripts -----------
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
    },

    // ----------- requests to google drive -----------
    async getMeta() {
      try {
        await this.$store.dispatch('getDataList', { col: 'meta' })
      } catch (err) {
        console.log('error', err)
      }
    },
    async deleteAllData() {
      try {
        await this.$store.dispatch('deleteDataList', { col: 'all' })
      } catch (err) {
        console.log('error', err)
      }
    },
    async getAllData() {
      try {
        await this.$store.dispatch('getDataList', { col: 'all' })
      } catch (err) {
        console.log('error', err)
      }
    },
  },
  watch: {
    isLoggedIn: {
      async handler(nv) {
        if (nv) {
          await this.getAllData()
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