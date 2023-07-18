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
:global(body .el-message-box__title) {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.3;
}

:global(body .el-message-box__message>p>div) {
  line-height: 1.3;
  margin-bottom: 8px;
}
</style>
