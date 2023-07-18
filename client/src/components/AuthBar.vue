<template>
  <div class="sign-in" @click="handleAuthClick" v-if="isIn ?? (isScriptsLoaded && !isLoggedIn)">
    <slot name="signIn">
      <el-button size="large" :icon="iconGoogle">
        Войти с помощью Google
      </el-button>
    </slot>
  </div>
  <div class="sign-out" @click="handleSignoutClick" v-if="isOut ?? (isScriptsLoaded && isLoggedIn)">
    <slot name="signOut">
      <el-button>
        Выйти
      </el-button>
    </slot>
  </div>
</template>
<style scoped>
.sign-in,
.sign-out {
  display: inline-block;
}
</style>
<script>
import { API_KEY, CLIENT_ID, DISCOVERY_DOC, SCOPES } from '../config'
import Google from '../components/icons/Google.vue'
import { shallowRef } from 'vue'

let gapi, google

export default {
  setup() {
    return {
      iconGoogle: shallowRef(Google)
    }
  },
  props: {
    type: String, // in | out
  },
  data() {
    return {
      tokenClient: undefined,
      gapiInited: false,
      gisInited: false,
    }
  },
  computed: {
    isScriptsLoaded() {
      return this.gapiInited && this.gisInited
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    filesComp() {
      return this.$store.getters.getList('all')
    },
    isIn() {
      return this.type === 'in'
    },
    isOut() {
      return this.type === 'out'
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
        window.location.replace('/main')
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
      this.$confirm('Вы хотите выйти из системы?', '', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('logout')
          this.$message({
            type: 'success',
            message: 'Вышли',
          })
        })
        .then(() => this.$router.push({ path: '/login' }))
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Действие отменено',
          })
        })
      // this.$store.dispatch('logout')
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
  },
  mounted() {
    if (!window.gapi) this.loadAndHandleScript('https://apis.google.com/js/api.js', this.gapiLoaded)
    else this.gapiLoaded()
    if (!window.google) this.loadAndHandleScript('https://accounts.google.com/gsi/client', this.gisLoaded)
    else this.gisLoaded()
  }
}
</script>