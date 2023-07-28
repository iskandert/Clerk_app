<template>
  <div class="view-container">
    <div class="actions">
      <el-card class="actions_card">
        <div class="title">
          <div class="title_text">
            <h4>
              <el-link @click="jumpRoute('/actions')">
                Текущие операции
              </el-link>
            </h4>
            <p>Записи по доходам, расходам, накоплениям</p>
          </div>
          <div class="title_icon">
            <el-icon :size="50" color="var(--el-color-gray-light-8)">
              <Clock />
            </el-icon>
          </div>
        </div>
        <el-button @click="openFullForm" class="mobile-adding" :icon="iconPlus" type="primary" round>Добавить</el-button>
        <el-card class="adding_form">
          <ActionsForm class="light" />
        </el-card>
      </el-card>
    </div>
    <div class="plans">

      <el-card style="">
        <div class="title">
          <div class="title_text">
            <h4>
              <el-link @click="jumpRoute('/analitic')">
                Аналитика
              </el-link>
            </h4>
            <p>Показатели по операциям на месяц, на год</p>
          </div>
          <div class="title_icon">
            <el-icon :size="50" color="var(--el-color-gray-light-8)">
              <DataAnalysis />
            </el-icon>
          </div>
        </div>
      </el-card>
    </div>
    <div class="analitic">
      <el-card>
        <div class="title">
          <div class="title_text">
            <h4>
              <el-link @click="jumpRoute('/plans')">
                Планирование
              </el-link>
            </h4>
            <p>Состав бюджета, финансовые цели</p>
          </div>
          <div class="title_icon">
            <el-icon :size="50" color="var(--el-color-gray-light-8)">
              <Calendar />
            </el-icon>
          </div>
        </div>

      </el-card>

    </div>
  </div>
</template>
<script>
import { shallowRef } from 'vue'
import {
  Clock,
  Calendar,
  DataAnalysis,
  CirclePlusFilled
} from '@element-plus/icons-vue'
import ActionsForm from '../components/ActionsForm.vue'

export default {
  components: {
    Clock,
    Calendar,
    DataAnalysis,
    ActionsForm
  },
  setup() {
    return {
      iconPlus: shallowRef(CirclePlusFilled)
    }
  },
  data() {
    return {
      word: '',
    }
  },
  methods: {
    jumpRoute(path) {
      this.$router.push({ path })
    },
    openFullForm() {
      this.$router.push({ path: '/actions', query: { mobile: true } })
    },
  }
}
</script>
<style scoped>
.view-container {
  display: grid;
  gap: 12px;
  align-items: start;
}

.actions,
.plans,
.analitic {
  display: grid;
  gap: 12px;
}

.actions_card>:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.actions_card .el-button {
  align-self: flex-end;
}

.title {
  display: flex;
  gap: 12px;
}

.title_text {
  flex-grow: 1;
}

.adding_form {
  display: none;
  box-shadow: none;
  background-color: var(--el-color-primary-dark-1);
}

/*
.adding_form :is(h5, p) {
  color: var(--el-color-white);
}

.adding_form :deep(label) {
  color: var(--el-color-transparent-dark-2);
}

.adding_form .link {
  display: block;
  text-align: right;
  margin-top: -8px;
}

.adding_form .el-link {
  --el-link-text-color: var(--el-color-transparent);
  --el-link-hover-text-color: var(--el-color-white);
}

.adding_form .adding_form__button {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}*/

@media (min-width: 768px) {

  .view-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .actions_card .el-button.mobile-adding {
    display: none;
  }

  .adding_form {
    display: block;
  }
}
</style>