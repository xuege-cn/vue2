// 依赖收集
class Vue {
  constructor (options) {
    new Observer(this, options.data)
    new Watcher(this, 'company.name')
  }
}

const utils = {
  isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  parsePath (expr) {
    const segments = expr.split('.')
    return function (obj) {
      for(let segment of segments){
        obj = obj[segment]
      }
      return obj
    }
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
    let dep = new Dep()
    Object.defineProperty(this.vm, key, {
      configurable: true,
      enumerable: true,
      get () {
        dep.depend()
        return val
      },
      set (newVal) {
        if (val === newVal) return
        console.log(`正在设置属性${key}，旧值为${val}，新值为${newVal}`)
        val = newVal
        dep.notify()
      }
    })
  }
}

class Dep {
  constructor () {
    this.subs = []
  }
  depend () {
    if (Dep.target) {
      this.subs.push(Dep.target)
    }
  }
  notify () {
    for (let sub of this.subs) {
      sub.update()
    }
  }
}

class Watcher {
  constructor (vm, expr) {
    this.vm = vm
    this.getter = utils.parsePath(expr)
    this.val = this.get()
    this.cb = (newVal, val) => { console.log(`触发update，新值为${newVal}，旧值为${val}`) }
  }

  get () {
    Dep.target = this
    const result = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return result
  }

  update () {
    const newVal = this.getter.call(this.vm, this.vm)
    this.cb.call(this.vm, newVal, this.val)
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

vm.company.name = 'club factory'