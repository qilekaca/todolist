import { ref } from 'vue'

export default function useTodo(list) {
  let todoContent = ref('')
  const add = () => {
    const todo = {
      id: new Date().getTime(),
      content: todoContent.value,
      status: false
    }
    list.value.unshift(todo)
    todoContent.value = ''
  }
  const del = (id) => {
    list.value = list.value.filter((x) => x.id !== id)
  }
  const done = (id) => {
    for (const item of list.value) {
      if (item.id === id) {
        item.status = !item.status
      }
    }
  }

  return {
    todoContent,
    add,
    del,
    done
  }
}
