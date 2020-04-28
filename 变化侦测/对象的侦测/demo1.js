class Vue {
  constructor (options) {
    new Observer(this, options.data)
  }
}

class Observer {
  constructor (vm, data) {
    this.vm = vm
    this.walk(data)
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let key of keys) {
      this.defineReactive(obj, key, obj[key])
    }
  }

  defineReactive (obj, key, val) {
    Object.defineProperty(this.vm, key, {
      configurable: true,
      enumerable: true,
      get () {
        return val
      },
      set (newVal) {
        if (val === newVal) return
        val = newVal
      }
    })
  }
}

const vm = new Vue({
  data: {
    name: 'demo'
  }
})
console.log(vm.name)
vm.name = 'xuqiang'
console.log(vm.name)