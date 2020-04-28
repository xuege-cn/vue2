// 几个问题？
// 1. 数组如何进行侦测？ -> 重写数组方法，在observe的时候赋给__proto__
// 2. Observe实例中如何保存依赖？
// 3. 数组的重写函数中如何获取当前的observer实例
// 4. 定义在Observe实例中的__ob__如何不被reactive，因为这样会导致死循环
// 5. 什么时候进行数组的依赖收集？
class Vue {
  constructor(options){
    new Observe(this, options.data)
    new Watcher(this)
  }
}

const utils = {
  isPlainObject (obj) {
    return ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(obj))
  },
  getRewriteArrayMethod () {
    const arrayProto = Array.prototype
    const arrayMethods = Object.create(arrayProto);
    ['pop', 'push', 'shift', 'unshift', 'sort', 'reverse', 'splice'].forEach(method => {
      const originalMethod = arrayProto[method]
      Object.defineProperty(arrayMethods, method, {
        value (...args) {
          console.log(`拦截到${method}方法，参数为${args}`)
          originalMethod.apply(this, args)
          const ob = this.__ob__
          ob.dep.notify()
        },
        configurable: true,
        enumerable: true
      })
    })
    return arrayMethods
  }
}

class Observe {
  constructor (vm, data) {
    this.vm = vm
    this.dep = new Dep()
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    })
    if (Array.isArray(data)) {
      data.__proto__ = utils.getRewriteArrayMethod()
    } else {
      this.walk(data)
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let key of keys) {
      this.defineReactive(obj, key, obj[key])
    }
  }

  defineReactive (obj, key, val) {
    let childOb
    if (utils.isPlainObject(val)) {
      childOb = new Observe(val, val)
    }
    Object.defineProperty(this.vm, key, {
      configurable: true,
      enumerable: true,
      get () {
        if (childOb) {
          childOb.dep.depend()
        }
        return val
      },
      set (newVal) {
        if (val === newVal) return
        val = newVal
      }
    })
  }
}

class Dep {
  constructor () {
    this.subs = []
  }
  depend () {
    Dep.target && this.subs.push(Dep.target)
  }
  notify () {
    for(let sub of this.subs) {
      sub.update()
    }
  }
}

class Watcher {
  constructor (vm) {
    this.vm = vm
    this.val = this.get()
    this.cb = (newVal, val) => { console.log(`开始update，新值为${newVal}，旧值为${val}`) }
  }
  get () {
    Dep.target = this
    let val = Array.from(this.vm.nums)
    Dep.target = null
    return val
  }
  update () {
    const newVal = this.vm.nums
    this.cb.call(this.vm, newVal, this.val)
  }
}

const vm = new Vue({
  data: {
    nums: [1, 2, 3]
  }
})

vm.nums.push(4)