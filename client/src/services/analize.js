const getIsNormalDistribution = (data, threshold = 0.05) => {
    // тест Шапиро-Уилка
    // Сортируем данные
    const sortedData = data.slice().sort((a, b) => a - b);
    const n = sortedData.length;

    // Вычисляем коэффициенты W
    const mean = sortedData.reduce((acc, val) => acc + val, 0) / n;
    const deviations = sortedData.map(value => value - mean);
    const sumSquaredDeviations = deviations.reduce((acc, val) => acc + val * val, 0);
    const W =
        Math.pow(
            deviations.reduce((acc, val, i) => acc + val * sortedData[n - 1 - i], 0),
            2
        ) /
        sumSquaredDeviations /
        (n * n);

    // Вычисляем статистику теста
    const mu = -1.272145 + 1.05162 / Math.sqrt(n);
    const sigma = 1.0304 - 0.08465 / Math.sqrt(n);
    const z = Math.log(W);
    const Z = (z - mu) / sigma;

    // Вычисляем p-значение
    const p = 1 - Math.exp(-Math.exp(Z));

    // Возвращаем результат теста
    return {
        statistic: W,
        pValue: p,
        isNormal: p > threshold,
    };
};

const getStandardDeviation = data => {
    // data: number[]
    const n = data.length;
    if (!n) return 0;
    const mean = data.reduce((acc, val) => acc + val, 0) / n;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
    return Math.sqrt(variance);
};

const getIdsInNormalDistribution = data => {
    // data: { _id, value: number }
    // проверка по правилу 3-х сигм
    const dataStdDevs = data.map(({ value }) => value);
    const stdDev = getStandardDeviation(dataStdDevs);
    if (getIsNormalDistribution(dataStdDevs).isNormal) {
        const mean = dataStdDevs.reduce((sum, curr) => sum + curr, 0) / data.length;
        const lowerBound = mean - 3 * stdDev;
        const upperBound = mean + 3 * stdDev;

        return data
            .filter(({ value }) => value >= lowerBound && value <= upperBound)
            .map(({ _id }) => _id);
    } else {
        return data.map(({ _id }) => _id);
    }
};

const getPearsonCorrelation = (dataX, dataY, threshold = 0.05) => {
    // Вычисляем количество элементов в массиве
    const n = dataX.length;
    // Инициализируем переменные для сумм
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    // Вычисляем суммы всех значений и их произведений
    for (let i = 0; i < n; i++) {
        sumX += dataX[i];
        sumY += dataY[i];
        sumXY += dataX[i] * dataY[i];
        sumX2 += dataX[i] * dataX[i];
        sumY2 += dataY[i] * dataY[i];
    }

    // Вычисляем числитель и знаменатель формулы коэффициента корреляции Пирсона
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    const k = numerator / denominator;

    return { 
      k: k.toFixed(2), 
      isPositive: k >= threshold,
      isNegative: k <= -threshold,
    };
};

export { getStandardDeviation, getIdsInNormalDistribution, getPearsonCorrelation };
