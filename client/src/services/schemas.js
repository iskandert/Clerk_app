export default {
  table: {
    _id: '',
    name: 'План 1',
    plans_id: [],
    _createdAt: '',
  },
  category: {
    _id: '',
    name: 'Расходы 1',
    type: 'expense', // in income, expense
    kind: 'default', // in default, savings
    _createdAt: '',
  },
  action: {
    _id: '',
    category_id: '',
    sum: 0,
    date: '',
    comment: '',
    _createdAt: '',
  },
  plan: {
    _id: '',
    category_id: '',
    sum: 0,
    date: '',
    comment: '',
    _createdAt: '',
  },
  config: {
    startBalance: 0,
  },
}
