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

<script setup>
import useList from '@/composables/useList'
import useTodo from '@/composables/useTodo'
import useFilter from '@/composables/useFilter'

const { list } = useList()
export { list }
const { todoContent, add, del, done } = useTodo(list)
export { todoContent, add, del, done }
const { nav, selected, filterList, changeNav } = useFilter(list)
export { nav, selected, filterList, changeNav }
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
