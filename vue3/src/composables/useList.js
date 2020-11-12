import { ref, onMounted, watch } from 'vue'

export default function useList() {
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

  return {
    list,
    getList
  }
}
