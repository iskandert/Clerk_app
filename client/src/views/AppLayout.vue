<template>
  <AuthBar />
  <main>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import AuthBar from '../components/AuthBar.vue'
</script>