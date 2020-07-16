import Vue from 'vue'
import Vuex from 'vuex'
// 导入axios用于获取public下的list.json数据
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框输入的内容
    inputValue: 'aaa',
    // 定义新建任务的id
    nextId: 5,
    // 当前展示的视图
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为store中的inputValue赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除项
    removeItem(state, id) {
      // 根据id查找对应项索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引删除对应元素
      if (id !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, params) {
      // 查找索引
      const i = state.list.findIndex(x => x.id === params.id)
      if (i !== -1) {
        state.list[i].done = params.status
      }
    },
    // 清除已完成的任务
    clearDone(state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      axios.get('./list.json').then(({
        data
      }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 未完成任务的条数
    unDoneLength(state) {
      return state.list.filter(x => x.done === false).length
    },
    // 根据不同的viewkey显示不同的list
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => x.done === false)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done === true)
      }
      return state.list
    }
  },
  modules: {}
})
