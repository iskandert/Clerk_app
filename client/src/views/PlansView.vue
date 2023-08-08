<template>
  <div class="container">
    <el-card>
      <div class="title">
        <h4>Планы по месяцам и категориям</h4>
        <div class="button-bar">

          <template v-if="!isMobileSize">
            <el-button @click="isShowedBalance = !isShowedBalance" :type="isShowedBalance ? 'primary' : ''" round plain
              :icon="iconLock">Баланс</el-button>
            <el-button @click="isShowedSavings = !isShowedSavings" :type="isShowedSavings ? 'primary' : ''" round plain
              :icon="iconCoin">Накопления</el-button>
            <el-button @click="isShowedDinamic = !isShowedDinamic" :type="isShowedDinamic ? 'primary' : ''" round plain
              :icon="iconDinamic">Изменения</el-button>
            <el-button @click="isReversedLayout = !isReversedLayout" :type="isReversedLayout ? 'primary' : ''" round plain
              :icon="iconFlip">Перевернуть</el-button>
          </template>

          <el-popover v-else :width="200" trigger="click">
            <template #reference>
              <el-button :icon="iconMore" type="info" plain circle></el-button>
            </template>
            <div class="checkbox-bar">
              <h5>Настройки отображения</h5>
              <el-checkbox v-model="isShowedBalance">Баланс</el-checkbox>
              <el-checkbox v-model="isShowedSavings">Накопления</el-checkbox>
              <el-checkbox v-model="isShowedDinamic">Изменения</el-checkbox>
              <el-checkbox v-model="isReversedLayout">Перевернуть</el-checkbox>
            </div>
          </el-popover>
          <!-- <el-switch v-model="isReversedLayout" active-text="По месяцам" inactive-text="По категориям"></el-switch> -->
        </div>
      </div>
      <div class="table">
        <el-table :data="plansByCategories" row-key="_id" default-expand-all border max-height="var(--table-height)"
          @row-click="toggleExpand" ref="plansTable" v-if="!isReversedLayout">
          <el-table-column :width="isMobileSize ? 130 : 180" fixed class="category-column">
            <template #header>
              <div class="desktop-only">
                <div class="table-title tips">
                  <div>Месяца</div>
                  <div>Категории</div>
                </div>
              </div>
            </template>
            <template #default="{ row: category }">
              <span class="category-name"
                :class="[category.status, category.type, category.children ? 'parent-category' : '']">
                <template v-if="category.type === 'default'">
                  <el-icon v-if="category.status === 'income'" class="symbol plus" :size="10">
                    <Plus />
                  </el-icon>
                  <el-icon v-if="category.status === 'expense'" class="symbol minus" :size="10">
                    <Minus />
                  </el-icon>
                </template>
                <template v-if="category.type === 'savings'">
                  <el-icon v-if="category.status === 'expense'" class="symbol lock" :size="14">
                    <Lock />
                  </el-icon>
                  <el-icon v-if="category.status === 'income'" class="symbol unlock" :size="14">
                    <Unlock />
                  </el-icon>
                </template>
                <span>{{ category.name }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column v-for="(date, index) in datesList" :key="index" width="110">
            <template #header>
              <div class="table-title dates">
                <div class="desktop-only">{{ $dayjs(date).format('MMMM YY') }}</div>
                <div class="mobile-only">{{ $dayjs(date).format('MM.YYYY') }}</div>
                <PlansBalance v-if="isShowedBalance" :sum="10000000" :dinamic="9000" type="default"
                  :is-show-dinamic="isShowedDinamic" />
                <PlansBalance v-if="isShowedSavings" :sum="90000000" :dinamic="300000" type="savings"
                  :is-show-dinamic="isShowedDinamic" style="margin:4px 0 4px" />
              </div>
            </template>
            <template #default="{ row: category }">
              <template v-if="category.plans">
                <div class="plan-item">
                  <PlansItem :sum="category.plans[date]?.sum" :status="category.status" />
                </div>
              </template>
              <div class="plans-sum" v-else>
                <PlansItem :sum="plansByDatesObj[date]?.sums?.[category.status] || 0" type="all"
                  :status="category.status" />
              </div>
            </template>
          </el-table-column>
          <template #append>
            <div class="add-category-row">
              <el-icon :size="12">
                <Plus />
              </el-icon>
              <div>Добавить категорию</div>
            </div>
          </template>
        </el-table>

        <el-table v-else :data="datesList" border ref="plansTable2" max-height="var(--table-height)">
          <el-table-column :width="isMobileSize ? 80 : 120" fixed class="dates-column">
            <template #header>
              <div class="desktop-only">
                <div class="table-title tips" :class="{ gaped: isReversedLayout }">
                  <div>Категории</div>
                  <div>Месяца</div>
                </div>
              </div>
            </template>
            <template #default="{ row: date }">
              <div class="date">
                {{ $dayjs(date).format(isMobileSize ? 'MM.YYYY' : 'YYYY MMMM') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="isShowedBalance" width="110" fixed label="Остаток">
            <template #default="{ row: date }">
              <PlansBalance :sum="10000000" :dinamic="9000" type="default" :is-show-dinamic="isShowedDinamic" />
            </template>
          </el-table-column>
          <el-table-column v-if="isShowedSavings" width="110" fixed label="Накопления">
            <template #default="{ row: date }">
              <PlansBalance :sum="90000000" :dinamic="300000" type="savings" :is-show-dinamic="isShowedDinamic" />
            </template>
          </el-table-column>
          <el-table-column v-for="(categGroup, index) in plansByCategories" :key="index" :label="categGroup.name">
            <template #header>
              <div class="table-title table-header" :class="[categGroup.status, categGroup.type]">
                <div>{{ categGroup.name }}</div>
              </div>
            </template>
            <el-table-column width="110" v-for="(category, index) in [categGroup, ...categGroup.children]" :key="index"
              :label="category.name">
              <template #header>
                <div class="table-title table-header" :class="[category.status, category.type]">
                  <div>{{ category.type ? category.name : 'Всего' }}</div>
                </div>
              </template>
              <template #default="{ row: date }">
                <template v-if="category.type">
                  <div class="plan-item">
                    <PlansItem :sum="category.plans[date]?.sum" :status="category.status" />
                  </div>
                </template>
                <div class="plans-sum" v-else>
                  <PlansItem :sum="plansByDatesObj[date]?.sums?.[category.status] || 0" type="all"
                    :status="category.status" />
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- <h1>plansByCategories</h1>
        <pre>{{ plansByCategories }}</pre>
        <h1>plansByDates</h1>
        <pre>{{ plansByDates }}</pre> -->
      </div>
      <div class="button-container">
        <el-button round type="primary" :size="isMobileSize ? 'large' : ''">Добавить план</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { shallowRef } from 'vue'
import ActionsBar from '../components/ActionsBar.vue'
import PlansBalance from '../components/PlansBalance.vue'
import PlansItem from '../components/PlansItem.vue'
import { mapObject, getEntityField, getObjectFromArray, getFormattedCount } from '../services/utils'
import { Lock, Unlock, Plus, Minus, Coin, Refresh, Sort, MoreFilled } from '@element-plus/icons-vue'

export default {
  components: { ActionsBar, PlansItem, Lock, Unlock, Plus, Minus, PlansBalance },
  setup() {
    return {
      iconLock: shallowRef(Lock),
      iconCoin: shallowRef(Coin),
      iconDinamic: shallowRef(Sort),
      iconFlip: shallowRef(Refresh),
      iconMore: shallowRef(MoreFilled),
    }
  },
  data() {
    return {
      isReversedLayout: false,
      isShowedBalance: true,
      isShowedSavings: true,
      isShowedDinamic: true,
      isShowedPercentage: true,
      //
      getFormattedCount
    }
  },
  computed: {
    categoriesStored() {
      return this.$store.getters.getData('categories') || []
    },
    categoriesObj() {
      return getObjectFromArray(this.categoriesStored)
    },
    categories() {
      let categories = [
        {
          _id: 'income',
          status: 'income',
          name: 'Доходы',
          children: []
        },
        {
          _id: 'expense',
          status: 'expense',
          name: 'Расходы',
          children: []
        },
      ]
      this.categoriesStored?.forEach(category => {
        if (category.status === 'expense') return categories[1].children.push(category)
        return categories[0].children.push(category)
      })
      return categories.map(categs => {
        categs.children = ['default', 'savings'].map(categType => categs.children
          .filter(({ type }) => categType === type)
          .sort((a, b) => {
            const [nameA, nameB] = [a.name, b.name]
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })).reduce((result, curr) => result.concat(curr))
        return categs
      })
    },
    plansStored() {
      return this.$store.getters.getData('plans')?.filter(({ sum }) => sum > 500) || []
    },
    plansDates() {
      const dates = new Set(this.plansStored.map(({ date }) => this.$dayjs(date).format('YYYY-MM')))
      return Array.from(dates).sort((a, b) => new Date(b) - new Date(a))
    },
    datesList() {
      const dates = []
      let date = this.plansDates.at(-1)
      let maxDate = this.plansDates[0]
      let dateAfterYear = this.$dayjs(date).add(12, 'month').format('YYYY-MM')
      if (!this.$dayjs(maxDate).isAfter(dateAfterYear)) maxDate = dateAfterYear
      dates.push(date)
      do {
        date = this.$dayjs(date).add(1, 'month').format('YYYY-MM')
        dates.push(date)
      } while (!this.$dayjs(date).isAfter(maxDate))
      return dates
    },
    plansByCategories() {
      let plans = Object.fromEntries(this.categoriesStored.map(({ _id }) => [_id, []]))
      this.plansStored.forEach(plan => {
        plans[plan.category_id].push(plan)
      })
      return this.categories.map(categsGroups => ({
        ...categsGroups,
        children: categsGroups.children.map(categ => {
          categ.plans = mapObject(getObjectFromArray(plans[categ._id], 'date'), (k, v) => {
            return [this.$dayjs(k).format('YYYY-MM'), v]
          }, true)
          return categ
        })
      }))
    },
    plansByDates() {
      let plans = Object.fromEntries(this.plansDates.map(date => [date, []]))
      let sums = mapObject(plans, () => ({
        income: 0,
        expense: 0,
      }))
      this.plansStored.forEach(plan => {
        const date = this.$dayjs(plan.date).format('YYYY-MM')
        const status = this.categoriesObj[plan.category_id].status
        plans[date].push(plan)
        sums[date][status] = Math.round((sums[date][status] + plan.sum) * 100) / 100
      })
      return this.plansDates.map(date => {
        return {
          date,
          sums: sums[date],
          plans: plans[date],
        }
      })
    },
    plansByDatesObj() {
      return getObjectFromArray(this.plansByDates, 'date')
    },
    isMobileSize() {
      return this.$store.getters['getWindowSizeState']
    },
  },
  methods: {
    toggleExpand(row, col) {
      if (col?.no !== 0) return
      this.$refs.plansTable.toggleRowExpansion(row)
    },
  },
}
</script>
<style scoped>
.container {
  display: grid;
  gap: 12px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title>h4 {
  margin: 0;
}

.title>.button-bar {
  align-self: flex-end;
}

.button-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-bar>button {
  margin: 0;
}

.checkbox-bar {
  display: flex;
  flex-direction: column;
}

.el-table {
  border-radius: 8px;
  border: 1px solid var(--el-color-gray);
  --table-height: calc(100dvh - var(--header-height) - var(--footer-height-mobile) - 188px);
  --table-height: calc(100vh - var(--header-height) - var(--footer-height-mobile) - 188px);
}

:deep(.el-table__header-wrapper) {
  box-shadow: var(--el-box-shadow-light);
  position: relative;
  z-index: 10;
}

:deep(.el-table__body-wrapper) {
  z-index: 5;
}

:deep(.el-table__inner-wrapper) {
  border: none;
}

.el-table :deep(.el-table__cell) {
  padding: 4px 0;
}

:deep(.cell) {
  padding: 0 8px;
  height: 100%;
}

.table-title.tips {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.table-title.tips.gaped {
  gap: 28px;
}

.table-title.tips>div:first-of-type {
  align-self: flex-end;
}

.category-column :deep(.cell) {
  display: flex;
  align-items: baseline;
}

.el-table :deep(.cell) {
  text-overflow: initial;
}

:deep(.el-table__placeholder) {
  display: none;
}

.category-name {
  word-break: keep-all;
  overflow-wrap: break-word;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.category-name:not(.parent-category) {
  margin-left: -18px;
}

:deep(.el-table__cell):has(.category-name.income) {
  background-color: var(--el-color-success-light-9);
}

:deep(.el-table__cell):has(.category-name.expense) {
  background-color: var(--el-color-info-light-9);
}

:deep(.el-table__cell):has(.category-name.parent-category.income) {
  background-color: var(--el-color-success-light-8);
  cursor: pointer;
}

:deep(.el-table__cell):has(.category-name.parent-category.expense) {
  background-color: var(--el-color-info-light-8);
  cursor: pointer;
}

.category-name.income>span {
  color: var(--el-color-success-dark-2);
}

.category-name.expense>span {
  color: var(--el-color-info-dark-2);
}

.symbol {
  display: flex;
  width: 16px;
}

.symbol.plus,
.symbol.plus+span {
  color: var(--el-color-success);
}

.symbol.unlock,
.symbol.unlock+span {
  color: var(--el-color-danger);
}

.symbol.lock,
.symbol.lock+span {
  color: var(--el-color-primary);
}

.symbol.minus,
.symbol.minus+span {
  color: var(--el-color-info);
}

.plans-sum {
  font-weight: bold;
}

.table .el-table {
  --el-table-border: 1px solid var(--el-border-color-darker);
}

.table .el-table :deep(.is-group .el-table__cell) {
  background-color: var(--el-color-white);
}

.table .el-table :deep(.el-table__cell):has(.table-header.income) {
  background-color: var(--el-color-success-light-9);
}

.table .el-table :deep(.el-table__cell):has(.table-header.expense) {
  background-color: var(--el-color-info-light-9);
}

.table-header {
  word-break: keep-all;
}

.table-header.income {
  color: var(--el-color-success);
}

.table-header.income.savings {
  color: var(--el-color-danger);
}

.table-header.expense {
  color: var(--el-color-info);
}

.table-header.expense.savings {
  color: var(--el-color-primary);
}

.date {
  color: var(--el-text-color-secondary);
  font-weight: bold;
}

.add-category-row {
  padding: 8px 8px 16px;
  display: flex;
  align-items: center;
  color: var(--el-color-primary);
  gap: 6px;
  cursor: pointer;
}

.add-category-row:hover {
  background-color: var(--el-color-primary-light-9);
}

.add-category-row:active {
  background-color: var(--el-color-primary-light-8);
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

@media (min-width: 768px) {
  .title {
    flex-direction: row;
    align-items: center;
  }

  .title>.button-bar {
    align-self: flex-end;
  }

  .el-table {
    --table-height: calc(100dvh - var(--header-height) - var(--footer-height) - 152px);
    --table-height: calc(100vh - var(--header-height) - var(--footer-height) - 152px);
  }

  .button-container {
    justify-content: right;
  }
}
</style>