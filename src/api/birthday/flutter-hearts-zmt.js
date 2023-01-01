/**
 * @ProjectName flutter-hearts-zmt
 * @Version 0.0.0
 * @Author 李港豪
 * @Update 2022-01-24 17:24 pm
 */
import 'jquery'
!(function(t, e) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = e() : typeof define === 'function' && define.amd ? define(e) : t.BubbleHearts = e()
}(window, function() {
  'use strict'

  function t(t, n, r) {
    var i = e.uniformDiscrete(89, 91) / 100
    var o = 1 - i
    var u = (e.uniformDiscrete(45, 60) + e.uniformDiscrete(45, 60)) / 100
    var a = function(t) {
      return t > i ? Math.max(((1 - t) / o).toFixed(2), 0.1) * u : u
    }
    var c = e.uniformDiscrete(-30, 30)
    var f = function(t) {
      return c
    }
    var h = 10
    var s = n.width / 2 + e.uniformDiscrete(-h, h)
    var d = (n.width - Math.sqrt(Math.pow(t.width, 2) + Math.pow(t.height, 2))) / 2 - h
    var l = e.uniformDiscrete(0.8 * d, d) * (e.uniformDiscrete(0, 1) ? 1 : -1)
    var m = e.uniformDiscrete(250, 400)
    var w = function(t) {
      return t > i ? s : s + l * Math.sin(m * (i - t) * Math.PI / 180)
    }
    var v = function(e) {
      return t.height / 2 + (n.height - t.height / 2) * e
    }
    var p = e.uniformDiscrete(14, 18) / 100
    var g = function(t) {
      return t > p ? 1 : 1 - ((p - t) / p).toFixed(2)
    }
    return function(e) {
      if (!(e >= 0)) return !0
      r.save()
      var n = a(e)
      var i = f(e)
      var o = w(e)
      var u = v(e)
      r.translate(o, u), r.scale(n, n), r.rotate(i * Math.PI / 180), r.globalAlpha = g(e), r.drawImage(t, -t.width / 2, -t.height / 2, t.width, t.height), r.restore()
    }
  }
  var e = (function(t) {
    var e = t
    var n = Math.floor
    var r = Math.random
    return t.uniform = function(t, e) {
      return t + (e - t) * r()
    }, t.uniformDiscrete = function(t, r) {
      return t + n((r - t + 1) * e.uniform(0, 1))
    }, t
  }({}))
  var n = function(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  var r = (function() {
    function t(t, e) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n]
        r.enumerable = r.enumerable || !1, r.configurable = !0, 'value' in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
      }
    }
    return function(e, n, r) {
      return n && t(e.prototype, n), r && t(e, r), e
    }
  }())
  var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(t) {
    return setTimeout(t, 16)
  }
  var o = (function() {
    function o() {
      n(this, o)
      var t = this.canvas = document.createElement('canvas')
      var e = this.context = t.getContext('2d')
      var r = this._children = []
      var u = function n() {
        i(n), e.clearRect(0, 0, t.width, t.height)
        for (var o = 0, u = r.length; o < u;) {
          var a = r[o]
          a.render.call(null, (a.timestamp + a.duration - new Date()) / a.duration) ? (r.splice(o, 1), u--) : o++
        }
      }
      i(u)
    }
    return r(o, [{
      key: 'bubble',
      value: function(n) {
        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e.uniformDiscrete(2400, 3600)
        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t(n, this.canvas, this.context)
        return this._children.push({
          render: i,
          duration: r,
          timestamp: +new Date()
        }), this
      }
    }]), o
  }())
  return o
}))
