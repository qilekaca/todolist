import { ref, computed } from 'vue'

export default function useFilter(list) {
  const nav = ['全部', '未完成', '完成']
  const selected = ref('全部')

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
  const changeNav = (title) => {
    selected.value = title
  }
  return {
    nav,
    selected,
    filterList,
    changeNav
  }
}
