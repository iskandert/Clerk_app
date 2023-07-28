<template>
  <div class="form-container" :class="$attrs.class">
    <h5>{{ mode === 'mini' ? 'Быстрое добавление' : 'Добавить операцию' }}</h5>
    <el-form :model="newAction" :rules="actionRules" label-position="top" ref="actionForm">
      <el-form-item label="Сумма операции" prop="sum">
        <el-input-number v-model="newAction.sum" :min="1" :step="100" />
      </el-form-item>
      <el-form-item label="Категория операции" prop="category_id">
        <el-select v-model="newAction.category_id" filterable>
          <el-option-group label="Расходы">
            <el-option v-for="({ name, _id }, index) in categories?.expense" :key="index" :value="_id"
              :label="name"></el-option>
          </el-option-group>
          <el-option-group label="Доходы">
            <el-option v-for="({ name, _id }, index) in categories?.income" :key="index" :value="_id"
              :label="name"></el-option>
          </el-option-group>
          <el-option-group label="Накопления">
            <el-option v-for="({ name, _id }, index) in categories?.savings" :key="index" :value="_id"
              :label="name"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <template v-if="mode === 'full'">
        <h6>Дополнительно</h6>
        <span></span>
        <el-form-item label="Дата операции" prop="date">
          <el-date-picker v-model="newAction.date" :disabled-date="(time) => time.getTime() > Date.now()" type="date"
            placeholder="Выберите дату" format="DD.MM.YYYY" />
        </el-form-item>
        <el-form-item label="Комментарий">
          <el-input v-model="newAction.comment" :rows="3" type="textarea" placeholder="Подробности операции"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="link" v-if="mode === 'mini'">
      <el-link :class="{ 'el-link--primary': !isLightTheme }" @click="openFullForm">
        Дополнительные настройки
      </el-link>
    </div>
    <div class="adding_form__button">
      <el-button :class="{ 'el-button--primary': !isLightTheme }" @click="addAction" :icon="iconCheck" round>
        Сохранить
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  CirclePlusFilled,
  Select
} from '@element-plus/icons-vue'
import { shallowRef } from 'vue';
import { cloneByJSON, notifyWrap } from '../services/utils';
import { Actions } from '../services/changings';

const clearAction = {
  category_id: undefined,
  sum: undefined,
  date: undefined,
  comment: undefined,
}

export default {
  props: {
    mode: {
      type: String,
      default: 'mini' // mini | full
    }
  },
  setup() {
    return {
      iconPlus: shallowRef(CirclePlusFilled),
      iconCheck: shallowRef(Select),
    }
  },
  data() {
    return {
      newAction: {},
      actionRules: {
        sum: [{ required: true, message: 'Сумма - обязательное поле', trigger: 'blur' }],
        category_id: [{ required: true, message: 'Категория - обязательное поле', trigger: 'blur' }],
        date: [{ required: true, message: 'Дата - обязательное поле', trigger: 'change' }],
      }
    }
  },
  computed: {
    isLightTheme() {
      return this.$attrs.class?.includes('light')
    },
    categoriesStored() {
      return this.$store.getters.getData('categories')
    },
    categories() {
      const categories = {
        income: [],
        expense: [],
        savings: [],
      }
      this.categoriesStored?.forEach(category => {
        if (category.type === 'income') return categories.income.push(category)
        if (category.kind === 'default') return categories.expense.push(category)
        return categories.savings.push(category)
      })
      return categories
    }
  },
  methods: {
    jumpRoute(path) {
      this.$router.push({ path })
    },
    openFullForm() {
      this.$router.push({ path: '/actions', query: this.newAction })
    },
    addAction() {
      this.$refs.actionForm.validate(async valid => {
        if (!valid) {
          this.$notify({
            title: 'Проверьте поля формы',
            type: 'error'
          })
          return false
        }
        try {
          const actions = new Actions()
          // this.newAction.date = this.$dayjs(this.newAction.date).format()
          const changes = actions.add(this.newAction)
          await this.$store.dispatch('saveDataChanges', changes)
        } catch (err) {
          notifyWrap(err)
        }
      })
    }
  },
  mounted() {
    console.log(this.$attrs);
    this.newAction = cloneByJSON(clearAction)
    Object.keys(clearAction).forEach(field => {
      this.newAction[field] = this.$route.query[field]
    })
    if (!this.newAction.date) this.newAction.date = new Date()
  },
}
</script>
<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.el-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 12px;
  margin-top: 4px;
}

/* color-theme */
/* START */
.form-container.light :is(h5, p) {
  color: var(--el-color-white);
}

.form-container.light h6 {
  color: var(--el-color-transparent-dark-2);
}

.form-container.light :deep(label) {
  color: var(--el-color-transparent-dark-2);
}

.form-container .link {
  display: block;
  text-align: right;
  margin-top: -4px;
}

.form-container.light .el-link {
  --el-link-text-color: var(--el-color-transparent);
  --el-link-hover-text-color: var(--el-color-white);
}

.form-container.light .el-form-item.is-required:not(.is-no-asterisk).asterisk-left>:deep(.el-form-item__label:before),
.form-container.light :deep(.el-form-item__error) {
  color: var(--el-color-danger-light-5);
}

.form-container.light .el-form-item.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger-light-5) inset;
}

/* END */

.form-container .adding_form__button {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  align-self: flex-end;
}

.form-container.light :deep(.is-focus.el-input__wrapper),
.form-container.light :deep(.el-textarea__inner:focus) {
  --el-select-input-focus-border-color: var(--el-color-gray-light-9);
  --el-input-focus-border-color: var(--el-color-gray-light-9);
}
</style>