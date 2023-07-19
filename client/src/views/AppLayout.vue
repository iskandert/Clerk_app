<template>
  <div class="app-container">
    <header>
      <div class="section-container">
        <AppHeader />
      </div>
    </header>
    <main>
      <div class="section-container">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <div :key="route.name">
              <component :is="Component"></component>
            </div>
          </transition>
        </router-view>
      </div>
    </main>
    <footer>
      <div class="section-container">
        <AppFooter />
      </div>
    </footer>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {}
  }
}
</script>
<style>
:root {
  --header-height: 40px;
  --footer-height: 40px;
  --footer-height-mobile: 64px;
}
</style>
<style scoped>
.app-container {
  height: 100vh;
  height: 100dvh;
  position: relative;
}

header,
main,
footer {
  width: 100vw;
  overflow: hidden;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--el-color-primary-dark-2);
}

main {
  background-color: var(--el-color-info-light-8);
}

footer {
  position: fixed;
  top: calc(100vh - var(--footer-height-mobile));
  top: calc(100dvh - var(--footer-height-mobile));
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid var(--el-text-color-disabled);
  padding-bottom: var(--footer-height);
}

.section-container {
  width: calc(100% - 32px);
  /*background-color: rgba(255, 255, 255, 0.5);*/
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

header>.section-container {
  min-height: var(--header-height);
}

main>.section-container {
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height-mobile);
}

footer>.section-container {
  min-height: var(--footer-height-mobile);
}

@media (min-width: 768px) {
  :root {
    --footer-height: 64px;
  }

  /* mobile width */
  footer {
    position: static;
    padding-bottom: 0;
    background-color: var(--el-color-info-light-8);
    border: none;
  }

  footer>.section-container {
    min-height: var(--footer-height);
  }

  main {
    background-color: #fff;
  }

  main>.section-container {
    min-height: calc(100vh - var(--footer-height));
    min-height: calc(100dvh - var(--footer-height));
    padding-bottom: 0;
  }

  .section-container {
    max-width: 1200px;
  }

}

@media (min-width: 992px) {
  /* mobile height */

}
</style>