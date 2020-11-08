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
export default {
  name: 'App',
  data() {
    return {
      list: [],
      nav: ['全部', '未完成', '完成'],
      selected: '全部',
      todoContent: ''
    }
  },
  mounted() {
    this.list = JSON.parse(localStorage.getItem('todos') || '[]')
  },
  computed: {
    filterList() {
      switch (this.selected) {
        case '未完成':
          return this.list.filter((x) => x.status === false)
        case '完成':
          return this.list.filter((x) => x.status === true)
        default:
          return this.list
      }
    }
  },
  watch: {
    list: {
      handler: function(val) {
        localStorage.setItem('todos', JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    add() {
      const todo = {
        id: new Date().getTime(),
        content: this.todoContent,
        status: false
      }
      this.list.unshift(todo)
      this.todoContent = ''
    },
    del(id) {
      this.list = this.list.filter((x) => x.id !== id)
    },
    done(id) {
      for (const item of this.list) {
        if (item.id === id) {
          item.status = !item.status
        }
      }
    },
    changeNav(title) {
      this.selected = title
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
