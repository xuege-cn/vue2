// 多层级data检测
class Vue {
  constructor (options) {
    new Observer(this, options.data)
  }
}

const utils = {
  isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
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
    if (utils.isPlainObject(val)) {
      new Observer(val, val)
    }
    Object.defineProperty(this.vm, key, {
      configurable: true,
      enumerable: true,
      get () {
        return val
      },
      set (newVal) {
        if (val === newVal) return
        console.log(`正在设置属性${key}，旧值为${val}，新值为${newVal}`)
        val = newVal
      }
    })
  }
}

const vm = new Vue({
  data: {
    name: 'demo',
    company: {
      name: 'jiayun'
    }
  }
})
console.log(vm.company.name)
vm.company.name = 'club factory'
console.log(vm.company.name)