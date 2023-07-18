<template>
  <div class="container">
    <div class="btn-container">
      <AuthBar type="in" />
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
  gap: 8px;
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
      this.$alert(
        `
        <div>Мы не храним данные о вашем бюджете.
        Информация сохраняется в отдельной папке на вашем Google диске.</div>
        <div>К другим папкам и файлам наше приложение не будет иметь доступа.</div>
        `,
        'Это нужно для безопасного хранения данных',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Понятно!'
        })
    }
  },
  mounted() {
    console.log("login");
  },
}
</script>
