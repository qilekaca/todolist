# composition api

## 对比 vue2

要讨论 composition api 的好处，就不得不先说说 vue2 中 option api 的不好。当我们开发 vue 项目时，经常可以看到大几百行代码的 vue 文件，当我们想要增加一些新的功能时就需要在在文件中反复的的上下移动。先 data 中添加变量，在 methods 中添加函数，在钩子函数中添加内容，又需要在 computed 中添加计算属性，在 watch 中设置监听等等。处理同一功能的代码分散在多个部分。这种碎片化使的理解和维护复杂的组件变得困难。

<!-- more -->

> 在 vue2 中为了解决这种问题我们可以通过 mixin 来解决。但是还是存在一些问题。vue 中 this 上的这些属性的来源很模糊，有可能是 mixin 进来的也有可能是全局 install，还有可能 Vue.prototype.设置的。当调试时就会很混乱。而且 mixin 还有问题就是变量名，当两个 mixin 中存在同一个变量，这时其中一个变量发生改变则另一个 mixin 中的变量也会跟着改变。

composition 的出现就很好的解决了上述的问题，通过组合的方式将分散在 data、methods、computed、 watch 等等位置的代码重新组合，一个功能的代码放在一起维护。
例如一个简单地 todolist 项目使用 vue 开发时可能是这样的。首先在 mounted 钩子中去获取 localStorage 中的 list 列表。使用 watch 函数监听 list 的变化，每次变化的时候去更新 localStorage 中的 list。使用 computed 过滤完成的 todo 和未完成的 todo 的 list。使用 methods 完成 todo 的增加、删除、修改、完成未完成标签页的切换。可以看到很多处理同一功能的代码分散在 data、methods、computed、watch、生命周期钩子等地方，如果使用同一颜色划分同一功能，那么 vue2 的代码大概是这个样子的。
![Vue2](https://note-1256536434.cos.ap-beijing.myqcloud.com/img/vue2.png)

## 升级 Vue3

### setup

下面我们以这个 vue2 的 todolist 项目为例，通过将它升级成 vue3 来学习一下 composition api。如果要使用 composition api 首先需要使用它的地方。在 vue3 中我们将此位置称为 setup。

> Setup 选项是一个接收 props 和 context 的函数，此外 setup 返回的所有内容都将暴露给组件的其余部分（计算属性、方法、生命周期钩子等等）以及组件的模版。

setup 组件选项在组件创建之前执行。在 vue3 没有了 beforeCreate，created 这两个钩子，取而代之的是 setup。由于执行 setup 时尚未创建组件实例，因此在 setup 选项中没有 this，这意味着除了 props 之外，我们将无法访问组件中声明的任何属性-本地状态、计算属性、或方法。

按照主要的功能划分这个 todolist 可以分成三大基本功能

- 首先是 list 的获取
- 过滤 list（按照 todo 的完成和未完成状态进行过滤）
- todo 的添加删除和状态的修改

首先改造 list 获取。当进入程序时先去 localStorage 中获取，如果不存在就返回一个空数组，存在就返回 localStorage 中保存的 list。同时监听 list 的变化，当 list 发生变化时将变化保存到 localStorage 中。

```vue
<script>
export default {
  setup() {
    let list = []
    const getList = () => {
      list = JSON.parse(localStorage.getItem('todos') || '[]')
    }
    return {
      list,
      getList
    }
  }
}
</script>
```

### 响应式

这样改造之后它还不能够工作。因为 list 是非响应式的（list 发生变化不会显示到页面）。在 vue3 中我们可以通过 ref 函数使变量变为响应式变量（list 的变化会体现在页面上）。

```js
import { ref } from 'vue'
const list = ref([])
```

ref 接收参数并返回它包装在具有 value property 的对象中，然后可以使用该 property 访问或更改响应式变量的值。

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

> 简单理解就是 ref 对我们的值创建了一个响应式引用。使用引用的概念将在整个组合式 api 中经常使用。
> 在模版中访问不需要使用.value 进行访问
> 回到我们的例子，创建一个响应式的 list 变量

```vue
<template>
  <ul>
    <li v-for="item of list" :key="item.id">{{ item.content }}</li>
  </ul>
</template>
<script>
import { ref } from 'vue'
export default {
	let list = ref([])
	const getList = () => {
		list = JSON.parse(localStorage.getItem('todos') || '[]')
	}
	return {
		list,
		getList
	}
}
</script>
```

现在每当我们调用 getList 时，list 都将发生变化，视图将更新以反映更改。接下来就是在 mounted 钩子中调用 getList，并设置一个监听器，以便在 list 发生变化的时候将变化保存到 localStorage 中。

### 生命周期钩子

在 vue3 中使用生命周期钩子需要在 setup 中使用。在 vue3 中所有的钩子函数都要从 vue 中导出。相比于 vue2 要在钩子函数名前加上 on（类似于 onMounted，并且没有了 beforeCreate 和 created 这两个钩子）这些函数接受在组件调用钩子时将执行的回调。继续改造将 omMounted 添加到 setup 函数中。

```vue
<script>
import { ref, onMounted } from 'vue'
export default {
	let list = ref([])
	const getList = () => {
		list = JSON.parse(localStorage.getItem('todos') || '[]')
	}
	onMounted(() => {
		getList()
	})
	return {
		list,
		getList
	}
}
</script>
```

### watch

就像 vue2 中的 watch 选项监听一个变量一样，我们也可以使用从 vue3 中导入 watch 函数执行相同的操作。它接受 3 个参数

- 一个响应式引用或我们想要侦听的 getter 函数
- 一个回调
- 可选的配置选项(deep, immediate)
  举个例子

```js
import { ref, watch } from 'vue'

const counter = ref(0)

watch(
  // 要监听的变量
  counter,
  // 发生改变时执行的回调
  (newVal, oldVal) => {
    console.log('the new counter value is: ' + counter.calue)
  },
  // 配置选项deep是否深层监听，immediate是否立即执行
  { immediate: true }
)
```

每当 counter 被修改时（counter.value = 5），watch 将触发并执行回调（第二个参数），在这个例子中，它将把 the new counter value is: 5 输出到控制台中。现在将其应用到示例中

```js
<script>
import { ref, onMounted, watch } from 'vue'
export default {
	let list = ref([])
	const getList = () => {
		list.value = JSON.parse(localStorage.getItem('todos') || '[]')
	}
	onMounted(() => {
		getList()
	})
	watch(list, () => {
		localSotrage.setItem('todos', JSON.stringify(list.value))
	},
	{ deep: true }
	)

	return {
		list,
		getList
	}
}
</script>
```

## 处理过滤相关的内容

### computed

与 ref 和 watch 类似，也可以使用从 Vue 导入的 computed 函数在 Vue 组件外部创建计算属性。

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value)
console.log(twiceTheCounter.value)
```

在这里，computed 函数返回一个作为 computed 的第一个参数传递的 getter 类回调的输出的一个只读的响应式引用。为了访问新创建的计算变量的 value，我们需要像使用 ref 一样使用 .value property。

```vue
<script>
import { ref, onMounted, watch } from 'vue'
export default {
	let list = ref([])
	const getList = () => {
		list.value = JSON.parse(localStorage.getItem('todos') || '[]')
	}
	onMounted(() => {
		getList()
	})
	watch(list, () => {
		localSotrage.setItem('todos', JSON.stringify(list.value))
	},
	{ deep: true }
	)
    // -----------------------------------------------------

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
		list,
		getList,
        nav,
        selected,
        filterList,
        changeNav
	}
}
</script>
```

经过以上的改造，我们基本上已经把和 list 过滤相关的内容转移到了同一位置，现在我们可以继续将和 todo 添加、删除、完成相关的功能转移到同一位置。

## 处理 todo 相关功能

### methods

```vue
<script>
import { ref, onMounted, watch } from 'vue'
export default {
	let list = ref([])
	const getList = () => {
		list.value = JSON.parse(localStorage.getItem('todos') || '[]')
	}
	onMounted(() => {
		getList()
	})
	watch(list, () => {
		localSotrage.setItem('todos', JSON.stringify(list.value))
	},
	{ deep: true }
    )
    // -----------------------------------------------------

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

	// -----------------------------------------------------
	const todoContent = ref('')

	const add = () => {
		const todo = {
			id: new Date().getTime(),
			content: todoContent.value,
			status: false
        }
        // 处理ref声明的响应式变量在js中需要使用.value进行访问
		// 在html中不需要使用.value直接使用即可
		list.value.unshift(todo)
		todoContent.value = ''
	}

	const del = (id) => {
		list.value = list.value.filter((id) => x.id !== id)
	}

	const done = (id) => {
		for (const item of list.value) {
			if (item.id === id) {
				item.status = !item.status
			}
		}
    }

	return {
		list,
		getList,
        nav,
        selected,
        filterList,
        changeNav,
		add,
		del,
		done
	}
}
</script>
```

## 简化 setup 函数

### 化繁为简 - 组合式函数

至此我们就将 vue2 的项目初步升级成 vue3 了，但是可以发现这不就是将代码全都转移到 setup 函数中使其变得非常大吗？是的，所以我们需要按照功能将相关代码提取到一个独立的**组合式函数**中。然后再将这几个组合式函数引入到 App.vue 中使用它们。

```js
// src/composables/useList.js
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
```

```js
// src/composables/useTodo.js
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
    add,
    del,
    done
  }
}
```

```js
// src/composables/useFilter.js
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
```

```vue
<script>
import useList from '@/composables/useList'
import useTodo from '@/composables/useTodo'
import useFilter from '@/composables/useFilter'
export default {
  setup() {
    const { list } = useList()
    // useTodo和useFilter都需要使用list，通过传参传递给这两个函数
    const { add, del, done } = useTodo(list)
    const { nav, selected, filterList, changeNav } = useFilter(list)

    return {
      list,
      add,
      del,
      done,
      nav,
      selected,
      filterList,
      changeNav
    }
  }
}
</script>
```

### 一简再简 - script setup

不过我们可以看到 setup 函数最后的 return 还是集中的，有没有办法优化下呢，当然我们可以使用 vue3 的[setup script](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)功能，把 setup 这个配置优化掉一个功能 export 一次。

```vue
<script setup>
import useList from '@/composables/useList'
import useTodo from '@/composables/useTodo'
import useFilter from '@/composables/useFilter'

const { list } = useList()
export { list }
const { add, del, done } = useTodo(list)
export { add, del, done }
const { nav, selected, filterList, changeNav } = useFilter(list)
export { nav, selected, filterList, changeNav }
</script>
```
