!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("angular"), require("lodash"), require("jquery")) : "function" == typeof define && define.amd ? define(["angular", "lodash", "jquery"], t) : "object" == typeof exports ? exports.base = t(require("angular"), require("lodash"), require("jquery")) : e.base = t(e.angular, e.lodash, e.jquery)
}(this, function(e, t, n) {
    return function(e) {
        function t(r) {
            if (n[r])
                return n[r].exports;
            var i = n[r] = {exports: {},id: r,loaded: !1};
            return e[r].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.p = "", t(0)
    }([function(e, t, n) {
            var r;
            r = function(require, e, t) {
                "use strict";
                var r = "lp", i = window;
                n(1);
                var o = i.angular, u = n(2);
                e.start = function(e) {
                }, e.createModule = function(e, t) {
                    return e = [r, e].join("."), o.module(e, t)
                }, e.bootstrap = function(e, t) {
                    return o.bootstrap(e, t)
                }, e.utils = u, e.ng = o, e.requireWidget = i.requireWidget || n(3)
            }.call(t, n, t, e), !(void 0 !== r && (e.exports = r))
        }, function(t, n, r) {
            t.exports = e
        }, function(e, t, n) {
            var r;
            r = function(require, e, t) {
                "use strict";
                var r = n(4);
                e.deprecate = function(e, t, n) {
                    function i(e) {
                        var t = r.template(e), i = window.console, o = t(n);
                        !c && r.isObject(i) && (i.warn(o), c = !0)
                    }
                    function o() {
                        return i(t), e.apply(this, arguments)
                    }
                    var u = !1;
                    if (u === !0)
                        return e;
                    var c = !1;
                    return r.isString(e) || u === !1 ? i(e) : o
                }, r.mixin(e), t.exports = r
            }.call(t, n, t, e), !(void 0 !== r && (e.exports = r))
        }, function(e, t, n) {
            !function(t, r) {
                "use strict";
                e.exports = r(n(5), n(1))
            }(this, function(e, t) {
                "use strict";
                var n = {slice: Array.prototype.slice,clone: e.extend,isFunction: e.isFunction,isObject: e.isPlainObject,trim: e.trim,isAngularObject: function(e) {
                        return n.isObject(e) && n.isFunction(e.run)
                    }};
                return function() {
                    var e = n.slice.call(arguments), r = window.requirejs;
                    if (n.isFunction(r)) {
                        var i = {instance: e[0],config: n.clone(r.s.contexts._.config, {}),module: n.trim(e[1].replace(/.js$/, ""), "/")}, o = r.config(i.config);
                        try {
                            i.module = i.instance.myDefinition.sUrl.replace(/[^\/]*$/, "").replace(new RegExp("^" + i.config.baseUrl), "") + i.module
                            //add js extension if module is an absolute file path
                                            if(/^(https?:\/\/|file:\/\/\/)(.*)/.test(widget.module)) {
                                                widget.module += '.js';
                                            }
                        } catch (u) {
                        }
                        o([i.module, "base", "core"], function(e, r, o) {
                            var u = i.instance, c = "lp-widget-loading";
                            u.loading = function(e) {
                                c = e || c, t.element(u.body).addClass(c)
                            }, u.loaded = function(e) {
                                t.element(u.body).removeClass(c), "string" == typeof e && t.element(u.body).addClass(e)
                            }, n.isFunction(e) ? e.call(null, u) : n.isAngularObject(e) ? (e.config(["$provide", "lpCoreUtils", "lpCoreI18nProvider", "lpCoreTemplateProvider", function(e, t, n, r) {
                                    t.isEmpty(u.getPreference("locale")) || n.useWidgetInstance(u), r.config({path: t.getWidgetBaseUrl(u)}), e.provider("lpWidget", function() {
                                        this.getInstance = this.$get = function() {
                                            return u
                                        }
                                    }), e.value("widget", u)
                                }]), t.bootstrap(u.body || u, [e.name])) : n.isObject(e) && n.isFunction(e.run) && e.run.call(null, "string" == typeof u ? t.element(u) : u)
                        })
                    }
                }
            })
        }, function(e, n, r) {
            e.exports = t
        }, function(e, t, r) {
            e.exports = n
        }])
});
