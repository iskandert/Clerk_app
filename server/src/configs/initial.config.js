import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

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
        _id: uuidv4(),
        name: 'План 1',
        plans_id: [],
        _createdAt: dayjs().format(),
      },
    ],
    categories: [
      ...defaultCategories.income.map((name) => ({
        _id: uuidv4(),
        name,
        type: 'income',
        kind: 'default',
        _createdAt: dayjs().format(),
      })),
      ...defaultCategories.expense.map((name) => ({
        _id: uuidv4(),
        name,
        type: 'expense',
        kind: 'default',
        _createdAt: dayjs().format(),
      })),
    ],
    actions: [],
    plans: [],
    config: {
      startBalance: 0,
    },
  }
}

export {
  //
  initEntities,
}
