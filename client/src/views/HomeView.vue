<template>
  <div class="container">

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
        <el-button class="mobile-adding" :icon="iconPlus" type="primary" round>Добавить</el-button>
        <el-card class="adding_form">
          <h5>Быстрое добавление</h5>
          <el-form label-position="top">
            <el-form-item label="Сумма операции">
              <el-input-number :min="1" :step="100" />
            </el-form-item>
            <el-form-item label="Категория операции">
              <el-select filterable>
                <el-option-group label="Расходы">
                  <el-option value="Еда" label="Еда"></el-option>
                  <el-option value="Транспорт" label="Транспорт"></el-option>
                  <el-option value="ЖКХ" label="ЖКХ"></el-option>
                </el-option-group>
                <el-option-group label="Доходы">
                  <el-option value="Подарки" label="Подарки"></el-option>
                  <el-option value="Зарплата" label="Зарплата"></el-option>
                </el-option-group>
                <el-option-group label="Накопления">
                  <el-option value="Крупное" label="Крупное"></el-option>
                  <el-option value="Путешествия" label="Путешествия"></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="link">
            <el-link>Дополнительные настройки</el-link>
          </div>
          <div class="adding_form__button">
            <el-button :icon="iconPlus" round>Добавить</el-button>
          </div>
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

export default {
  components: {
    Clock,
    Calendar,
    DataAnalysis
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
  },
}
</script>
<style scoped>
.container {
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
  background-color: var(--el-color-primary-light-3);
  box-shadow: none;
}

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
}

@media (min-width: 768px) {

  .container {
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