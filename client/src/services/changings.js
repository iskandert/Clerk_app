import dayjs from 'dayjs'
import schemas from './schemas'
import { cloneByJSON, isEqual } from './utils'
import { v4 as uuidv4 } from 'uuid'
// import { ElMessageBox } from 'element-plus'
// const { alert: elAlert, confirm: elConfirm, prompt: elPrompt } = ElMessageBox
// import router from '../router'

export class Entities {
  constructor(state) {
    this.state = cloneByJSON(state)
  }
  _generateId() {
    return uuidv4()
  }
  _create(obj) {
    const entity = {
      ...this.schema,
      ...obj,
      _id: this._generateId(),
      _createdAt: dayjs().format(),
    }
    return entity
  }
  _add(obj) {
    return this.state[this.field].data.push(obj)
  }
  _find(id) {
    let index
    const entity = this.state[this.field].data.find(({ _id }, idx) => {
      if (_id !== id) return false
      index = idx
      return true
    })
    return { entity, index }
  }
  _change(target, source) {
    return Object.assign(target, source)
  }
  _delete(index) {
    return this.state[this.field].data.splice(index, 1)
  }
  getResult() {
    // return { [this.field]: this.state[this.field] }
    return [
      {
        field: this.field,
        data: this.state[this.field].data,
      },
    ]
  }
  add(obj) {
    const entity = this._create(obj)
    this._add(entity)
    return this.getResult()
  }
  change(obj) {
    const { entity } = this._find(obj._id)
    this._change(entity, obj)
    return this.getResult()
  }
  delete(id) {
    const { index } = this._find(id)
    this._delete(index)
    return this.getResult()
  }
}

export class Tables extends Entities {
  constructor(state) {
    super(state)
    this.field = 'tables'
    this.schema = schemas.table
  }
  // change(obj) {
  //   const { entity, index } = this._find(obj._id)
  //   const beforeChanges = cloneByJSON(entity)
  //   const result = this.change(obj)
  //   if (isEqual(result[this.field][index].plans_id, beforeChanges.plans_id)) return result
  //   const unusable_plans_id = []
  //   result[this.field].forEach(({plans_id}) => {
  //     // plans_id.forEach(id => {
  //     //   if (this.state.plans)
  //     // })
  //   })
  //   // If unusable plans exist, delete these plans entities
  // }
  delete(id) {
    if (this.state[this.field].data.length < 2) throw new Error('Нельзя удалить последнюю таблицу')
    const { entity, index } = this._find(id)
    // const child_tables = this.state[this.field].data.filter(({inherited_id}) => inherited_id === entity._id)
    // if (child_tables.length > 0) {
    //   // If this table has children, in every entity delete inferited_id field
    //   // (or change on id of deleting table parent),
    //   // copy fields plans_id into child tables
    // }
    this._delete(index)
    const result = this.getResult()

    if (entity.plans_id.length) {
      const plans = new Plans(this.state)
      entity.plans_id.forEach((plan_id) => {
        plans.delete(plan_id)
      })
      // Object.assign(result, plans.getResult())
      result.concat(plans.getResult())
    }

    return result
  }
}

export class Categories extends Entities {
  constructor(state) {
    super(state)
    this.field = 'categories'
    this.schema = schemas.category
  }
  delete(id, { redefined_category_id }) {
    const { entity, index } = this._find(id)
    const result = []

    const categ_actions = this.state.actions.data.filter(({ category_id }) => entity._id === category_id)
    if (categ_actions.length) {
      const actions = new Actions(this.state)
      categ_actions.forEach((action) => {
        if (redefined_category_id && this._find(redefined_category_id).index >= 0) {
          actions.add({
            ...action,
            category_id: redefined_category_id,
          })
        }
        actions.delete(action._id)
        // Object.assign(result, actions.getResult())
        result.concat(actions.getResult())
      })
    }

    const categ_plans = this.state.plans.data.filter(({ category_id }) => entity._id === category_id)
    if (categ_plans.length) {
      const plans = new Plans(this.state)
      categ_plans.forEach((plan) => {
        if (redefined_category_id && this._find(redefined_category_id).index >= 0) {
          plans.add({
            ...plan,
            category_id: redefined_category_id,
          })
        }
        plans.delete(plan._id)
        // Object.assign(result, plans.getResult())
        result.concat(plans.getResult())
      })
    }

    this._delete(index)
    // Object.assign(result, this.getResult())
    result.concat(this.getResult())

    return result
    // if (categ_actions.length || categ_plans.length) {
    //   const actions_pseudo = categ_actions.length ? 'операции' : ''
    //   const plans_pseudo = categ_plans.length ? 'планы' : ''
    //   const pseudo_connector = actions_pseudo && plans_pseudo ? ' и ' : ''
    //   const pseudo = actions_pseudo + pseudo_connector + plans_pseudo
    //   elConfirm(
    //     `
    //     В удаляемой категории "${entity.name}" есть некоторые ${pseudo}.
    //     Переопределить их в другую категорию?
    //   `,
    //     'Категория не пустая',
    //     {
    //       confirmButtonText: 'Переопределить',
    //       cancelButtonText: 'Переопределить',
    //       cancelButtonClass: 'el-button--danger',
    //     }
    //   ).then(() => {
    //     router.push()
    //   })
    // }
  }
}

export class Actions extends Entities {
  constructor(state) {
    super(state)
    this.field = 'actions'
    this.schema = schemas.action
  }
  add(obj, { new_category_settings = {} }) {
    const actionSettings = cloneByJSON(obj)
    const result = []

    if (actionSettings.category_id === 'new') {
      const categories = new Categories(this.state)
      const newCategory = categories._create(new_category_settings)
      categories._add(newCategory)
      actionSettings.category_id = newCategory._id
      result.concat(categories.getResult())
    }

    super.add(actionSettings)
    result.concat(this.getResult())

    return result
  }
}

export class Plans extends Entities {
  constructor(state) {
    super(state)
    this.field = 'plans'
    this.schema = schemas.plan
  }
  add(obj, { new_category_settings = {}, current_table_id }) {
    const planSettings = cloneByJSON(obj)
    const result = []

    if (planSettings.category_id === 'new') {
      const categories = new Categories(this.state)
      const newCategory = categories._create(new_category_settings)
      categories._add(newCategory)
      planSettings.category_id = newCategory._id
      result.concat(categories.getResult())
    }

    const plan = this._create(planSettings)
    this._add(plan)
    result.concat(this.getResult())

    const tables = new Tables(this.state)
    for (const table of current_table_id ? [tables._find(current_table_id)] : tables.state.tables.data) {
      table.plans_id.push(plan._id)
    }
    result.concat(tables.getResult())

    return result
  }
  delete(id) {
    const result = []

    const tables = new Tables(this.state)
    tables.forEach((table) => {
      const plan_id_index = table.plans_id.indexOf(id)
      if (plan_id_index < 0) return
      table.plans_id.splice(plan_id_index, 1)
    })
    result.concat(tables.getResult())

    super.delete(id)
    result.concat(this.getResult())

    return result
  }
}

export class Config extends Entities {
  constructor(state) {
    super(state)
    this.field = 'config'
    this.schema = schemas.config
    delete this._generateId
    delete this._create
    delete this._add
    delete this._find
    delete this._delete
    delete this.add
    delete this.delete
  }
  change(obj) {
    this._change(this.state[this.field].data, obj)
    return this.getResult()
  }
}
