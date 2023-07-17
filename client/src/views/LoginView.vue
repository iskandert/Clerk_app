<template>
  <div class="container">
    <div class="btn-container">
      <AuthBar />
      <el-link type="primary" @click="openDescription">Зачем мне это нужно?</el-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
</style>
<script>
import AuthBar from '../components/AuthBar.vue'
import Google from '../components/icons/Google.vue'
import { shallowRef } from 'vue'

export default {
  components: { AuthBar },
  setup() {
    return {
      iconGoogle: shallowRef(Google)
    }
  },
  data() {
    return {
      descDialog: false,
    }
  },
  methods: {
    openDescription() {
      this.$alert(`Мы не храним данные о вашем бюджете.
        Информация сохраняется в отдельной папке на вашем Google диске. 
        К другим папкам и файлам наше приложение не будет иметь доступа.`,
        'Это нужно для безопасного хранения данных', {
        confirmButtonText: 'Понятно!'
      })
    }
  },
  mounted() {
    console.log("login");
  },
}
</script>
