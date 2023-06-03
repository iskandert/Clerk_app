import { computed, ref, watch } from 'vue'
import store from '../store'
import { ElMessage, ElMessageBox } from 'element-plus'
const { alert: elAlert, confirm: elConfirm, prompt: elPrompt } = ElMessageBox

function watchTokenExpiring() {
  console.log('in composable')
  const isTokenExpired = computed(() => {
    return store.getters.getList('isExpired')
  })

  watch(
    isTokenExpired,
    async (nv, ov) => {
      console.log('in composable watcher:', nv)
      if (!nv) return
      try {
        await elAlert(
          //
          `Почти истек срок действия ключа доступа для Google диска. 
      Чтобы продолжать безопасную работу, нужно пройти авторизацию снова`,
          'Требуется авторизация'
        )
      } catch (e) {
      } finally {
        console.log('yesss')
        store.dispatch('logout')
      }
    },
    { immediate: true }
  )
}

export { watchTokenExpiring }
