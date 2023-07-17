<script>
import { RouterView } from 'vue-router'
import store from './store';
import { watchTokenExpiring } from './composables/watchers';

export default {
  setup() {

    store.dispatch('setTokenExpiring')
    watchTokenExpiring()
  },
}
</script>

<template>
  <RouterView />
</template>

<style scoped>
:global(.el-message-box__title) {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.3;
}
</style>
