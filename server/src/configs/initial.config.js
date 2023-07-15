import { v4 as uuidv4 } from 'uuid'

const defaultCategories = {
  income: [
    //
    'Зарплата 1',
    'Зарплата 2',
    'Подарки',
    'Банк начисления',
  ],
  expense: [
    //
    'Еда',
    'Рестораны',
    'ЖКХ',
    'Связь',
    'Домашние питомцы',
    'Крупные траты',
    'Ремонт',
    'Накопления',
    'Обучение 1',
    'Обучение 2',
    'Спорт 1',
    'Спорт 2',
    'Одежда 1',
    'Одежда 2',
    'Подарки',
    'Путешествия',
    'Развлечения',
    'Транспорт',
    'Такси',
    'Автомобиль',
    'Здоровье',
    'Бытовое',
    'Прочее',
  ],
}

const initEntities = () => {
  return {
    tables: [
      {
        name: 'План 1',
        plans_id: [],
        _id: uuidv4(),
      },
    ],
    categories: [
      ...defaultCategories.income.map((name) => ({
        name,
        type: 'income',
        _id: uuidv4(),
      })),
      ...defaultCategories.expense.map((name) => ({
        name,
        type: 'expense',
        _id: uuidv4(),
      })),
    ],
    config: {
      startBalance: 0,
    },
    actions: [],
    plans: [],
  }
}

export {
  //
  initEntities,
}
