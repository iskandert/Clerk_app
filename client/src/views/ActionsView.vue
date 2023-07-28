<template>
  <div class="container">
    <div class="left-col">
      <div class="range__container">
        <el-card>Период</el-card>
      </div>
      <div class="plans__container">
        <el-card>Планы</el-card>
      </div>
      <div class="actions__container">
        <el-card>
          <el-scrollbar max-height="calc(100vh - var(--header-height) - var(--footer-height) - 120px)">
            <div class="actions">
              <template v-for="({ day, actions }, idx) in actionsByDays" :key="idx">
                <h6>{{ day }}</h6>
                <div class="action" v-for="(action, i) in actions" :key="i">
                  <div class="icon"></div>
                  <p class="text">
                  <p class="category">{{ getEntityField(categoriesStored, action.category_id) }}</p>
                  <span class="comment">{{ action.comment || 'Без комментария' }}</span>
                  </p>
                  <div class="sum" :class="getActionClass(action.category_id)">
                    <el-icon class="symbol plus" :size="10">
                      <Plus />
                    </el-icon>
                    <el-icon class="symbol minus" :size="10">
                      <Minus />
                    </el-icon>
                    <el-icon class="symbol lock" :size="14">
                      <Lock />
                    </el-icon>
                    <el-icon class="symbol unlock" :size="14">
                      <Unlock />
                    </el-icon>
                    <span class="count">{{ getFormattedCount(action.sum, 'currency') }}</span>
                  </div>
                </div>
              </template>
              <el-empty v-if="!actionsByDays?.length" description="Сохраненных операций пока нет"
                :image-size="163"></el-empty>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
    <div class="right-col">
      <div class="plans__container">
        <el-card>Планы</el-card>
      </div>
      <div class="form_desktop__container">
        <el-card class="primary-shadow">
          <ActionsForm class="light" mode="full" />
        </el-card>
      </div>
    </div>
    <div class="adding-button">
      <el-button @click="openActionDialog" class="primary-shadow" type="primary" size="large" round
        :icon="iconPlus">Добавить операцию</el-button>
    </div>

    <el-dialog width="100vw" v-model="actionDialog" :append-to-body="true">
      <template #header>
        <h4>Добавить операцию</h4>
      </template>
      <ActionsForm mode="full" />
    </el-dialog>
  </div>
</template>
<script>
import { shallowRef } from 'vue'
import ActionsForm from '../components/ActionsForm.vue'
import { getEntityField, getFormattedCount } from '../services/utils'
import { Lock, Unlock, Plus, Minus, CirclePlusFilled } from '@element-plus/icons-vue'

export default {
  components: { Lock, Unlock, Plus, Minus, ActionsForm },
  setup() {
    return {
      // iconPlus: shallowRef(Plus),
      iconPlus: shallowRef(CirclePlusFilled),
    }
  },
  data() {
    return {
      actionDialog: false,
      //
      getEntityField,
      getFormattedCount
    }
  },
  computed: {
    categoriesStored() {
      return this.$store.getters.getData('categories')
    },
    actionsStored() {
      return this.$store.getters.getData('actions')
    },
    actionsByDays() {
      const days = new Set(this.actionsStored?.map(({ date }) => date.split('T')[0]))
      const today = this.$dayjs(this.$dayjs().format('YYYY-MM-DD'))

      return Array.from(days).sort((a, b) => new Date(b) - new Date(a)).map(dateStr => {
        const date = this.$dayjs(dateStr)
        let displayedDate = date.format('D MMMM')

        if (date.year() < today.year()) displayedDate = this.$dayjs(dateStr).format('D MMMM YYYY[ г.]')
        if (!today.diff(date)) displayedDate = 'Сегодня'
        if (today.diff(date, 'day') === 1) displayedDate = 'Вчера'

        return {
          day: displayedDate,
          actions: this.actionsStored
            .filter(({ date }) => date.split('T')[0] === dateStr)
            .sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
        }
      })
    }
  },
  methods: {
    getActionClass(category_id) {
      let type = getEntityField(this.categoriesStored, category_id, 'type')
      let kind = getEntityField(this.categoriesStored, category_id, 'kind')
      return type + ' ' + kind
    },
    openActionDialog() {
      this.actionDialog = true
    }
  },
  mounted() {
    if (this.$route.query.mobile) this.actionDialog = true
  },
}
</script>
<style scoped>
.container {
  display: grid;
  gap: 12px;
  align-items: start;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.right-col {
  display: none;
}

.left-col {
  margin-bottom: 56px;
}

/* fixed .range__container on mobile */
/* START */
.plans__container {
  padding-top: 44px;
}

.range__container {
  position: fixed;
  transform: translateY(-16px);
  left: 0;
  right: 0;
  z-index: 1990;
}

/* END */

.el-scrollbar,
:deep(.el-scrollbar__wrap),
:deep(.el-scrollbar__view) {
  display: contents;
}

.actions>h6 {
  margin-bottom: 12px;
}

.actions>.action+h6 {
  margin-top: 24px;
}

.action {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.action>.icon {
  width: 36px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--el-color-gray);
}

.action>.text {
  flex-grow: 1;
}

.action>.text>.category {
  font-weight: bold;
}

.action>.text>.comment {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.action>.sum {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.action>.sum>.symbol {
  display: none;
}

.action>.sum.income.default>* {
  color: var(--el-color-success);
}

.action>.sum.income.savings>* {
  color: var(--el-color-danger);
}

.action>.sum.expense.savings>* {
  color: var(--el-color-primary);
}

.action>.sum.income.default>.symbol.plus,
.action>.sum.expense.default>.symbol.minus,
.action>.sum.income.savings>.symbol.unlock,
.action>.sum.expense.savings>.symbol.lock {
  display: flex;
}

.form_desktop__container .el-card {
  background-color: var(--el-color-primary-dark-1);
  border: none;
}

.adding-button {
  position: fixed;
  top: calc(100vh - var(--footer-height-mobile));
  top: calc(100dvh - var(--footer-height-mobile));
  transform: translateY(calc(-100% - 16px));
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {

  .left-col {
    margin-bottom: 0;
  }

  .el-scrollbar,
  :deep(.el-scrollbar__wrap),
  :deep(.el-scrollbar__view) {
    display: block;
  }

  .el-scrollbar {
    margin-right: -11px;
    padding-right: 11px;
  }

  .container {
    grid-template-columns: repeat(2, 1fr);
  }

  .left-col>.plans__container {
    display: none;
  }

  /* normal .range__container on desktop */
  /* START */
  .plans__container {
    padding-top: 0;
  }

  .range__container {
    position: static;
    transform: none;
  }

  /* END */

  .right-col {
    display: flex;
  }

  .adding-button {
    display: none;
  }
}
</style>