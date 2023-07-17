<template>
  <div>
    <div v-if="isLoggedIn">
      <button @click="getMeta">Get Files Meta</button>
      <button @click="deleteAllData">Delete App Data</button>
      <button @click="getAllData">Init & Get All Data</button>
    </div>
    <pre>{{ filesComp }}</pre>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    filesComp() {
      return this.$store.getters.getList('all')
    },
  },
  methods: {
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
}
</script>