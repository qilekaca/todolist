<template>
  <div id="app">
    <input v-model="todoContent" type="text" @keyup.enter="add" />
    <ul class="nav">
      <li
        v-for="title of nav"
        :key="title"
        @click="changeNav(title)"
        :class="{ active: selected === title }"
      >
        {{ title }}
      </li>
    </ul>
    <ul>
      <label v-for="item of filterList" :key="item.id" class="todo">
        <input type="checkbox" :checked="item.status" @click="done(item.id)" />
        <p>{{ item.content }}</p>
        <button @click="del(item.id)">删除</button>
      </label>
    </ul>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
export default {
  name: 'App',
  setup() {
    let list = ref([])
    const getList = () => {
      list.value = JSON.parse(localStorage.getItem('todos') || '[]')
    }
    onMounted(() => {
      getList()
    })
    watch(
      list,
      () => {
        localStorage.setItem('todos', JSON.stringify(list.value))
      },
      {
        deep: true
      }
    )
    // -------------------------
    let nav = ref(['全部', '未完成', '完成'])
    let selected = ref('全部')
    // 过滤列表
    const filterList = computed(() => {
      switch (selected.value) {
        case '未完成':
          return list.value.filter((x) => x.status === false)
        case '完成':
          return list.value.filter((x) => x.status === true)
        default:
          return list.value
      }
    })
    // 切换标签
    const changeNav = (title) => {
      selected.value = title
    }
    // ---------------------------
    let todoContent = ref('')
    // 添加todo
    const add = () => {
      const todo = {
        id: new Date().getTime(),
        content: todoContent.value,
        status: false
      }
      list.value.unshift(todo)
      todoContent.value = ''
    }
    // 删除todo
    const del = (id) => {
      list.value = list.value.filter((x) => x.id !== id)
    }
    // 修改todo
    const done = (id) => {
      for (const item of list.value) {
        if (item.id === id) {
          item.status = !item.status
        }
      }
    }
    return {
      list,
      nav,
      selected,
      filterList,
      changeNav,
      todoContent,
      add,
      del,
      done
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 10px auto;
}

.active {
  color: aqua;
}

.nav {
  display: flex;
  list-style-type: none;
  width: 150px;
  margin: 0 auto;
}

.todo {
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
}
</style>
