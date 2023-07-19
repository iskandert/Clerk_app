<template>
  <RouterView />
</template>

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

<style>
:root {
  --app-vsize-sm: 768px;
  --app-vsize-md: 992px;
  --app-vsize-lg: 1200px;
  --app-vsize-xl: 1920px;

  --el-color-primary: #21b7c9 !important;
  --el-color-primary-light-3: #44cdd9 !important;
  --el-color-primary-light-5: #69dbe3 !important;
  --el-color-primary-light-7: #9ce7ee !important;
  --el-color-primary-light-8: #bbf2f4 !important;
  --el-color-primary-light-9: #dbf6f9 !important;
  --el-color-primary-dark-2: #176d77 !important;
}

body .el-message-box__title {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.3;
}

body .el-message-box__message>p>div {
  line-height: 1.3;
  margin-bottom: 8px;
}
</style>
