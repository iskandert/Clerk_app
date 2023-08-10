<template>
  <div class="item-container">
    <template v-if="type === 'one'">
      <div class="item plan" :class="status" v-if="sum">{{ formattedSum }}</div>
      <div class="item empty" v-else>+</div>
    </template>
    <div v-else class="item all" :class="status">{{ formattedSum }}</div>
  </div>
</template>
<script>
import { getFormattedCount } from '../services/utils';

export default {
  props: {
    sum: {
      type: Number,
      default: 0
    },
    status: String,
    type: { // all | one
      type: String,
      default: 'one'
    },
  },
  data() {
    return {
      //
    }
  },
  computed: {
    formattedSum() {
      return getFormattedCount(this.sum, { accuracy: 0 })
    }
  },
}
</script>
<style scoped>
.item {
  text-align: center;
  border-radius: 6px;
}

.item:not(.all) {
  cursor: pointer;
  transition: background-color .15s;
}

.item.plan {
  font-weight: bold;
  color: var(--el-color-white);
}

.item.plan.expense {
  background-color: var(--el-color-info-light-3);
}

.item.plan.income {
  background-color: var(--el-color-success-light-3);
}

.item.empty {
  font-weight: bold;
  background-color: var(--el-color-white);
  color: var(--el-color-primary);
  border: 2px dotted;
  border-color: var(--el-color-primary);
}

.item.plan.expense:hover {
  background-color: var(--el-color-info);
}

.item.plan.income:hover {
  background-color: var(--el-color-success);
}

.item.empty:hover {
  background-color: var(--el-color-primary-light-9);
}

.item.plan.expense:active {
  background-color: var(--el-color-info-dark-2);
}

.item.plan.income:active {
  background-color: var(--el-color-success-dark-2);
}

.item.empty:active {
  background-color: var(--el-color-primary-light-8);
}

.item.all {
  font-weight: bold;
  border: 2px solid currentColor;
}

.item.all.income {
  color: var(--el-color-success);
}

.item.all.expense {
  color: var(--el-text-color-secondary);
}
</style>