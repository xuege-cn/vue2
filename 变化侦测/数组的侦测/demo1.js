class Vue {
  constructor(options){
    new Observe(this, options.data)
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
    if (utils.isPlainObject(val)) {
      new Observe(val, val)
    }
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
    nums: [1, 2, 3]
  }
})

vm.nums.push(4)
console.log(vm.nums)