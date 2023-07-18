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

      </div>
    </footer>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'

export default {
  components: {
    AppHeader
  },
  data() {
    return {
      headerHeight: '40px',
      footerHeight: '40px',
    }
  }
}
</script>
<style>
:root {
  --header-height: 40px;
  --footer-height: 40px;
}
</style>
<style scoped>
.app-container {
  height: 100vh;
  height: 100dvh;
  position: relative;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(186, 186, 186)
}

header,
main,
footer {
  width: 100vw;
  overflow: hidden;
}

footer {
  position: fixed;
  top: calc(100vh - var(--footer-height));
  top: calc(100dvh - var(--footer-height));
  left: 0;
  right: 0;
  background-color: aqua;
  padding-bottom: var(--footer-height);
}

.section-container {
  width: calc(100% - 32px);
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 auto;
}

header>.section-container {
  min-height: var(--header-height);
}

main>.section-container {
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: var(--header-height);
  padding-bottom: var(--footer-height);
}

footer>.section-container {
  min-height: var(--footer-height);
}

@media (min-width: 768px) {

  /* mobile width */
  footer {
    position: static;
    padding-bottom: 0;
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