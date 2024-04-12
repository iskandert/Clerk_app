<template>
    <el-card>
        <h4>Корреляция категорий бюджета</h4>
        <div class="content">
            <div class="controls">
                <el-badge :is-dot="hasSettings">
                    <el-button
                        :size="isMobileSize ? 'large' : ''"
                        :icon="iconDataAnalysis"
                        type="primary"
                        round
                        @click="isOpened = true"
                    >
                        Выбрать данные
                    </el-button>
                </el-badge>
                <el-checkbox
                    v-model="isRangedValues"
                    label="Сортировка по возрастанию"
                />
                <el-checkbox
                    v-model="isAbsoluteSums"
                    label="Абсолютные значения"
                />
            </div>
            <div
                v-if="sums"
                class="result"
                :style="correlationBackgroundColor"
            >
                <div class="koef">{{ correlation.k }}</div>
                <div class="title">
                    {{ correlation.title }}{{correlation.type ? ',' : ''}}
                </div>
                <div
                    class="type"
                >
                    {{ correlation.type }}
                </div>
            </div>
        </div>
        <div
            v-if="sums"
            class="chart-container"
        >
            <Line
                :data="data"
                :options="options"
            />
        </div>
    </el-card>

    <el-dialog
        width="min(100vw, 500px)"
        v-model="isOpened"
        :append-to-body="true"
        :before-close="() => handleCancelStatistic()"
        :destroy-on-close="true"
    >
        <template #header>
            <h4>Настроить корреляцию</h4>
        </template>
        <AnaliticCorrelationForm
            @call-to-end="handleCancelStatistic"
            :categories_ids="categoryIds"
            :dates="dates"
            class="dialog"
        />
    </el-dialog>
</template>
<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { dayjs, getCssVar, getFormattedCount } from '../services/utils';
import { ref, shallowRef, computed } from 'vue';
import store from '../store';
import { DataAnalysis } from '@element-plus/icons-vue';
import AnaliticCorrelationForm from './AnaliticCorrelationForm.vue';
import { getPearsonCorrelation } from '../services/analize';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const iconDataAnalysis = shallowRef(DataAnalysis);

const CORRELATION_STEPS = [
    { k: 0.05, title: 'Нет корреляции' },
    { k: 0.3, title: 'Слабая корреляция' },
    { k: 0.5, title: 'Умеренная корреляция' },
    { k: 0.7, title: 'Заметная корреляция' },
    { k: 0.9, title: 'Высокая корреляция' },
    { k: 1.1, title: 'Весьма высокая корреляция' },
];

const isOpened = ref(false);
const isRangedValues = ref(false);
const isAbsoluteSums = ref(true);
const categoryIds = ref([]);
const dates = ref([]);

const hasSettings = computed(() => {
    return categoryIds.value?.length && dates.value?.length;
});
const isMobileSize = computed(() => {
    return store.getters['getWindowSizeState'];
});
const plansStored = computed(() => {
    return store.getters.getData('plans') || [];
});
const plansCalc = computed(() => {
    return store.getters.getCalcs('plansIdsByDatesByCategoriesIds') || {};
});
const plansIndexes = computed(() => {
    return store.getters.getCalcs('plansIndexesByIds') || {};
});
const categoriesStored = computed(() => {
    return store.getters.getData('categories');
});
const categoriesChecked = computed(() => {
    return Object.fromEntries(
        categoryIds.value.map(id => [id, categoriesStored.value.find(({ _id }) => _id === id)])
    );
});
const sums = computed(() => {
    if (!categoryIds.value.length) return null;
    let category_a_sum = 0;
    let category_b_sum = 0;

    return dates.value
        .map(date => {
            const getSumByCategoryId = category_id => {
                return (
                    plansStored.value?.[
                        plansIndexes.value?.[plansCalc.value?.[date]?.[category_id]]
                    ]?.sum || 0
                );
            };

            const sum_a = getSumByCategoryId(categoryIds.value[0]);
            const sum_b = getSumByCategoryId(categoryIds.value[1]);
            category_a_sum += sum_a;
            category_b_sum += sum_b;

            return {
                sum_a,
                sum_b,
                date: dayjs(date).format('YYYY MMMM'),
            };
        })
        .map(data => ({
            ...data,
            nu_a: +(data.sum_a / category_a_sum).toFixed(2),
            nu_b: +(data.sum_b / category_b_sum).toFixed(2),
        }))
        .sort(({ sum_a: sum1 }, { sum_a: sum2 }) => {
            if (!isRangedValues.value) return 0;
            if (sum1 < sum2) return -1;
            if (sum1 > sum2) return 1;
        });
});
const correlation = computed(() => {
    const dataA = [];
    const dataB = [];
    sums.value.forEach(data => {
        dataA.push(data.sum_a);
        dataB.push(data.sum_b);
    });
    const result = getPearsonCorrelation(dataA, dataB);
    for (const { k, title } of CORRELATION_STEPS) {
        if (Math.abs(result.k) < k) {
            result.title = title;
            break;
        }
    }
    if (result.isNegative) {
        result.type = 'отрицательная';
    } else if (result.isPositive) {
        result.type = 'положительная';
    }
    return result;
});
const correlationBackgroundColor = computed(() => {
    const diff = correlation.value.k * 100;
    let isLess = diff < 0;

    let prefix = 'background-color:';
    const middleColor = 'var(--el-color-gray-light-3)';

    if (!diff) return prefix + middleColor;

    const diffAbs = Math.min(Math.abs(diff), 100);
    let endColor = 'var(--el-color-success-dark-2)';
    if (isLess) {
        endColor = 'var(--el-color-warning-dark-2)';
    }
    return prefix + `color-mix(in srgb, ${middleColor} ${100 - diffAbs}%, ${endColor})`;
});
const data = computed(() => {
    return {
        labels: sums.value.map(({ date }) => date),
        // TODO correlation line
        datasets: [
            {
                label: categoriesChecked.value[categoryIds.value[0]].name,
                data: sums.value.map(({ sum_a, nu_a }) => (isAbsoluteSums.value ? sum_a : nu_a)),
                backgroundColor: getCssVar('--el-color-primary'),
                borderColor: getCssVar('--el-color-primary-light-3'),
                // fill: {
                //     target: true,
                //     above: getCssVar('--el-color-gray-light-5') + '40',
                //     below: getCssVar('--el-color-danger') + '40',
                // },
                // tooltip: {
                //     callbacks: {
                //         label: context => {
                //             return (
                //                 ' ' + getFormattedCount(context.raw, { accuracy: 0 }) + ' - остаток'
                //             );
                //         },
                //     },
                // },
            },
            {
                label: categoriesChecked.value[categoryIds.value[1]].name,
                data: sums.value.map(({ sum_b, nu_b }) => (isAbsoluteSums.value ? sum_b : nu_b)),
                backgroundColor: getCssVar('--el-color-danger'),
                borderColor: getCssVar('--el-color-danger-light-3'),
            },
            // {
            //     label: 'C накоплениями',
            //     data: this.balances.map(({ total }) => total),
            //     backgroundColor: getCssVar('--el-color-primary'),
            //     borderColor: getCssVar('--el-color-primary-light-3'),
            //     fill: {
            //         target: 0,
            //         above: getCssVar('--el-color-primary') + '40',
            //         below: getCssVar('--el-color-gray-light-5') + '40',
            //     },
            //     tooltip: {
            //         callbacks: {
            //             label: context => {
            //                 return (
            //                     ' ' +
            //                     getFormattedCount(this.balances[context.dataIndex].savings || 0, {
            //                         accuracy: 0,
            //                     }) +
            //                     ' - накопления'
            //                 );
            //             },
            //             beforeLabel: context => {
            //                 return (
            //                     ' ' +
            //                     getFormattedCount(context.raw, { accuracy: 0 }) +
            //                     ' - с остатком'
            //                 );
            //             },
            //         },
            //     },
            // },
        ],
    };
});
const options = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            point: {
                radius: 5,
                hoverRadius: 7,
            },
            line: {
                cubicInterpolationMode: 'monotone',
            },
        },
        // scales: {
        //     y: {
        //         min:
        //             Math.min(0, ...this.balances.map(({ balance }) => balance)) &&
        //             undefined,
        //         max: Math.max(0, ...this.balances.map(({ total }) => total)) && undefined,
        //     },
        // },
        plugins: {
            legend: {
                display: true,
                labels: {
                    usePointStyle: true,
                },
            },
            // tooltip: {
            //     callbacks: {
            //         label: function (context) {
            //             return getFormattedCount(context.raw || 0, { accuracy: 0 });
            //         },
            //     },
            // },
        },
    };
});

const handleCancelStatistic = result => {
    if (result) {
        categoryIds.value = result.categories_ids;
        dates.value = result.dates;
    }
    isOpened.value = false;
};
</script>
<style scoped>
.chart-container {
    margin-top: 8px;
    height: 60vh;
}
.content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.controls {
    display: grid;
}
.controls > :first-child {
    margin-bottom: 8px;
}
.result {
    color: white;
    padding: 8px;
    border-radius: 8px;
}
.koef {
    font-weight: bold;
}
.scrollbar-content {
    height: 10px;
    width: 200vw;
}
</style>
