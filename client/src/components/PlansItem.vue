<template>
  <div class="item-container" @click="handleClick">
    <template v-if="type === 'one'">
      <div tabindex="0" class="item plan" :class="[status, isPast ? 'past' : '']" v-if="isDefinedSum">
        {{ formattedSum }}
      </div>
      <div tabindex="0" class="item empty" v-else>+</div>
    </template>
    <div v-else class="item all" :class="status">{{ formattedSum }}</div>
  </div>
</template>
<script>
import { getFormattedCount } from '../services/utils'

export default {
  props: {
    sum: {
      type: Number,
      default: undefined
    },
    status: String,
    type: { // all | one
      type: String,
      default: 'one'
    },
    date: String,
  },
  emits: ['call-to-edit'],
  data() {
    return {
      //
    }
  },
  computed: {
    isDefinedSum() {
      return this.sum !== undefined || this.isPast
    },
    isPast() {
      return this.date && this.$dayjs(this.date).isBefore(this.$dayjs(), 'month')
    },
    formattedSum() {
      return getFormattedCount(+this.sum || 0, { accuracy: 0 })
    }
  },
  methods: {
    handleClick() {
      if (this.isPast && this.isDefinedSum && this.type === 'one') return
      this.$emit('call-to-edit')
    }
  },
}
</script>
<style scoped>
.item {
  text-align: center;
  border-radius: 6px;
  font-weight: bold;
}

.item:not(.all, .past) {
  cursor: pointer;
  transition: background-color .15s;
}

.item.plan {
  color: var(--el-color-white);
}

.item.plan.expense {
  background-color: var(--el-color-info-light-3);
}

.item.plan.income {
  background-color: var(--el-color-success-light-3);
}

.item.plan.expense.past {
  background-color: var(--el-color-info-light-7);
}

.item.plan.income.past {
  background-color: var(--el-color-success-light-7);
}

.item.plan.expense.past,
.item.all.expense {
  color: var(--el-color-info-dark-2);
  border: 2px solid currentColor;
}

.item.plan.income.past,
.item.all.income {
  color: var(--el-color-success-dark-2);
  border: 2px solid currentColor;
}

.item.empty {
  font-weight: bold;
  background-color: var(--el-color-white);
  color: var(--el-color-primary);
  border: 2px dotted;
  border-color: var(--el-color-primary);
}

.item.plan.expense:not(.past):hover {
  background-color: var(--el-color-info);
}

.item.plan.expense:not(.past):active {
  background-color: var(--el-color-info-dark-2);
}

.item.plan.income:not(.past):hover {
  background-color: var(--el-color-success);
}

.item.plan.income:not(.past):active {
  background-color: var(--el-color-success-dark-2);
}

.item.empty:hover {
  background-color: var(--el-color-primary-light-9);
}

.item.empty:active {
  background-color: var(--el-color-primary-light-8);
}
</style>