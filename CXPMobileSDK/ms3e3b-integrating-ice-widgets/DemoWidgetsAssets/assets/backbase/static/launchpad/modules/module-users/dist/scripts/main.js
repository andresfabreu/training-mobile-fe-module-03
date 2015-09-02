!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("base"), require("core")) : "function" == typeof define && define.amd ? define(["base", "core"], t) : "object" == typeof exports ? exports["module-users"] = t(require("base"), require("core")) : e["module-users"] = t(e.base, e.core)
}(this, function(e, t) {
    return function(e) {
        function t(r) {
            if (o[r])
                return o[r].exports;
            var i = o[r] = {exports: {},id: r,loaded: !1};
            return e[r].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports
        }
        var o = {};
        return t.m = e, t.c = o, t.p = "", t(0)
    }([function(e, t, o) {
        var r;
        (function(e) {
            r = function(require, e, t) {
                "use strict";
                t.name = "module-user";
                var r = o(1), i = o(2), n = [i.name];
                t.exports = r.createModule(t.name, n).provider(o(3)).factory(o(4))
            }.call(t, o, t, e), !(void 0 !== r && (e.exports = r))
        }).call(t, o(5)(e))
    }, function(t, o, r) {
        t.exports = e
    }, function(e, o, r) {
        e.exports = t
    }, function(e, t, o) {
        var r;
        r = function(require, e, t) {
            "use strict";
            var o = {MISSING_USERNAME: "Please fill in your username",MISSING_PASSWORD: "Please fill in your password",MISSING_OTP: "You must provide otp code",CANNOT_AUTHENTICATE: "Sorry, we could not authenticate you with these credentials",MAX_ATTEMPTS_EXCEEDED: "Number of login attempts exceeded",ACCOUNT_BLOCKED: "Your account has been blocked",NOT_FOUND: "Resource not found",UNKNOWN_ERROR: "There was an error processing your request. Contact your administrator",DISCONNECTED: "Unable to connect. Please check your connection",FORBIDDEN: "Access has been denied due to security reasons"}, r = {UNKNOWN_ERROR: "UNKNOWN_ERROR",NOT_FOUND: "NOT_FOUND",BAD_REQUEST: "BAD_REQUEST",CANNOT_AUTHENTICATE: "CANNOT_AUTHENTICATE",MAX_ATTEMPTS_EXCEEDED: "MAX_ATTEMPTS_EXCEEDED",DISCONNECTED: "DISCONNECTED",FORBIDDEN: "FORBIDDEN"}, i = {INITIATED: "Initiated",VERIFIED: "Verified"};
            e.lpUsersAuthentication = function(e) {
                var t = {}, n = function(t) {
                    return !(e.isString(t) && e.trim(t).length)
                }, a = function(t) {
                    if (!e.isObject(t))
                        throw new Error("Argument `options` should be an object instead " + typeof t)
                }, s = function(o) {
                    return function(r) {
                        e.extend(t, r.session), o.resolve(r)
                    }
                }, c = {code: r.UNKNOWN_ERROR,message: o[r.UNKNOWN_ERROR]}, u = function(e) {
                    var t, o, i = e.errors;
                    return i && i.length && (t = i[0].code, t !== r.UNKNOWN_ERROR && (o = i[0].message)), {code: t || c.code,message: o || c.message}
                }, l = function(e) {
                    return function(t, i) {
                        var n;
                        switch (i) {
                            case 0:
                                n = {code: r.DISCONNECTED,message: o[r.DISCONNECTED]};
                                break;
                            case 400:
                                n = {code: r.BAD_REQUEST,message: t.message};
                                break;
                            case 401:
                                n = {code: r.CANNOT_AUTHENTICATE,message: o[r.CANNOT_AUTHENTICATE]};
                                break;
                            case 403:
                                n = {code: r.FORBIDDEN,message: o[r.FORBIDDEN]};
                                break;
                            case 404:
                                n = {code: r.NOT_FOUND,message: o[r.NOT_FOUND]};
                                break;
                            default:
                                n = u(t)
                        }
                        e.reject(n)
                    }
                }, d = {Accept: "application/json","Content-Type": "application/x-www-form-urlencoded"};
                this.$get = function(c, u, R) {
                    var p = {ERROR_CODE: r}, A = {initiateEndPoint: "",otpEndPoint: "",serverRootPath: "",portalName: "",pageName: ""};
                    return p.getConfig = function() {
                        return A
                    }, p.setConfig = function(t) {
                        return A = e(t).chain().mapValues(e.resolvePortalPlaceholders).defaults(A).value(), this
                    }, e.forEach(i, function(o) {
                        p["is" + e.capitalize(o)] = function() {
                            return t.status && t.status.toLowerCase() === o.toLowerCase()
                        }
                    }), p.initiate = function(t) {
                        var r, i = u.defer();
                        return a(t), n(t.username) ? r = o.MISSING_USERNAME : n(t.password) && (r = o.MISSING_PASSWORD), r ? i.reject(new Error(r)) : c({method: "POST",url: A.initiateEndPoint,data: e.buildQueryString(t),headers: d}).success(s(i)).error(l(i)), i.promise
                    }, p.securityCheck = function() {
                        var o = u.defer(), r = {j_username: t.username,j_password: t.id,portal_name: A.portalName,page_name: A.pageName};
                        return c({method: "POST",url: A.serverRootPath + "/j_spring_security_check?rd=" + (new Date).getTime(),data: e.buildQueryString(r),headers: d}).success(s(o)).error(l(o)), o.promise
                    }, p.verifyOTP = function(r) {
                        var i = u.defer();
                        return a(r), n(r.otpCode) ? i.reject(new Error(o.MISSING_OTP)) : c({method: "POST",url: A.otpEndPoint.replace("{id}", t.id),data: e.buildQueryString({otp_code: r.otpCode}),headers: d}).success(s(i)).error(l(i)), i.promise
                    }, p.handleVerifiedResponse = function(e) {
                        alert(JSON.stringify(e));
                    }, p.MOCKABLE = {session: t}, p
                }, this.$get.$inject = ["$http", "$q", "$window"]
            }, e.lpUsersAuthentication.$inject = ["lpCoreUtils"]
        }.call(t, o, t, e), !(void 0 !== r && (e.exports = r))
    }, function(e, t, o) {
        var r;
        r = function(require, e, t) {
            "use strict";
            e.lpDefaultProfileImage = function(e) {
                var t = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABPCAIAAADz89W0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MkVFRDI3OTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MkVFRDI3QTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyRUVEMjc3MkRFRDExRTNCRThDOTUwOURDMDIyMUU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjcyRUVEMjc4MkRFRDExRTNCRThDOTUwOURDMDIyMUU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gildPAAABRdJREFUeNrsmstKI0EUhicmRmO8IoKIgigoCoovIOhOX8m38RncuHWjG0HFjeAl4GWhoAvvUZPMZ/6ZQ9OtmUBa04OnFk2luqo9X51LnVMzqZWVlV8/qbX8+mHNgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR34O1umkcWVSiX4M5VK2Yj6PDUt9Co6GPxI6MvB+U0GDlL9MZiWluBe6KkJ9iqI8RmDjVeq7cO/1TQN8wTm9fX16ekpn88/Pj5ms1kky+VyLy8vdMrlMoOtra100um0MWgLghj0mfD29mav+JnJZJKiYWuA9fb2jo2NiRYwhL64uIBf0k9NTTFHWyMY5kRtVX0msIqfPK+vr0ulUnRrmgyMHF1dXQsLCz09PYChlpubm7W1tbu7O2SFbXx8fGZmxpiZDwzToobKTwhZgmKfn5/Pz883NjaKxaJMo3FR0/Pz841/Ba0iGSSDg4MPDw/Ih27b29uPj495hbUXCoWRkRGELlYb5MDAzCv6etJ4xaD2BWzGh4aGmHl5eVnD4b8PWPpBFbK6q6ur0dFRlCxzbWtrw6sZ7OjoQNXIPTs7y2ScOVttTGCVvFTN+lI7P/kyP9k4vhkLc6NBCwmQiT76RLdbW1vLy8tyP8inp6dPT09RFHi49Pb29sDAgMyVJ+N0YI6eW6yFljkMEvyYw19pftCSQ0osheWTk5OjoyNCFLolgGHGc3Nzm5ubnZ2dbMf6+jquzvj7H85kbLOCja+xO4uLi2wWO4I5yMJjceBGMy3bcsRCOBnhzs7O/f09CmcvwJ6cnAQbWgi7u7vhyVcbVIxg1cxkOX1G6LM1eDLBWX4hS47LgWMAthiLuKgCJEx3b2+PETk2KsV1IZS7QmgeyxL5M5y5apO1M5lpds4rqicrtUS94gESZoAnJib6+/sBYBcI3ZiojqtQvik1auNub2+xDu2j3CRGS47fhzVCrEJRGCR+u7S0pIAE5/DwsDpRYEuniOe7u7vsnbKO1N8WL3MMufT74VZNIVAvHY4f/JDgjEoVYC0g84x+oVRt5WpjrX3zizTcaHloSlBKaJkjZ698WOoy3do0dfTKEmw6+DNPTbCWFA2HVC0DVpOtKsYyfnBwsL+/T4gyk+aVlC8kebuKEL1VREhWPRws8aIVrD15RWp9dnYGQyhpEZvgdUQpb5MXVAItKUHLXM4MW/KZKeotZ4/O3mipYGvVOITxZKUllmNGLxuar+HQ1QT6URqsA5noRVIZugOIOoX8glWazEdk2DF6ciZ2J7E8RC4qbPItKkTxh6wjeDeiJcQ50hVLM1G4YkGC6uEQsIWcYMWD6HaVESo8dKppnBGcWaFLsZrz2WJbEjUsEqvvTWl20RHKW2zQtsBuCKiZqCsPDw/tbiiJGpboxFskNjyJa5VgjSs73RCpzKbuJ9ksFApkMhYLkwgMGInx6uoqRZKUo6u5f2rJ/FlVhOqwvr6+GAumr9Kwkko0U7+UZtLsi2KVQoDcwbKUJPqwLiikIrmxyil5bG0N6zKEQlpHsZRsdwzJ1TAiIqhiDzmj7qssONVYq9ybtVKsrUpWLh2NQBDKaaVnRFc9XOdyqVp3l1aZJNSkLdlUTLYiIXjY1nm1EDx77QxL6DkcyoHr+QexaGYe7SRUw9EEu55z5bOFH36qaRcA/11zYAd2YAd2YAd2YAd2YAd2YAd2YAd24B/QMrH/J4qkA8f7Pyhcw+7DzW6/BRgAykJQPtOgddIAAAAASUVORK5CYII=", o = function(e) {
                    var t = "";
                    e = e.split(" ");
                    for (var o = 0; o < e.length; o++)
                        t += e[o].substr(0, 1);
                    return t = t.toUpperCase()
                }, r = function(e) {
                    var t = e.charCodeAt(0) - 64, o = t + 120, r = Math.floor((t - 1) / 25 * 4 + 1 - 1), i = [[o, 210, 210], [o, o, 210], [210, o, o], [o, 210, o], [210, o, 210]];
                    return i[r]
                };
                return function(i, n, a, s) {
                    if (!arguments.length)
                        return t;
                    var c = document.createElement("canvas");
                    if (!c.getContext || !c.getContext("2d"))
                        return t;
                    var u = o(i);
                    s = s || r(u), c.setAttribute("width", n), c.setAttribute("height", a);
                    var l = c.getContext("2d");
                    l.fillStyle = e.isArray(s) ? "rgb(" + s.join(",") + ")" : s, l.fillRect(0, 0, n, a), l.fillStyle = "rgb(250,250,250)";
                    var d;
                    switch (u.length) {
                        case 1:
                            d = .6;
                            break;
                        case 2:
                            d = .5;
                            break;
                        case 3:
                            d = .45;
                            break;
                        default:
                            d = .3
                    }
                    var R = parseInt(d * a, 10), p = Math.floor(.15 * a);
                    return l.font = R + "px Proxima Regular, Helvetica Nueue, Helvetica, Arial, sans-serif", l.textAlign = "right", l.fillText(u, n - 3, a - p), c.toDataURL("image/png")
                }
            }, e.lpDefaultProfileImage.$inject = ["lpCoreUtils"]
        }.call(t, o, t, e), !(void 0 !== r && (e.exports = r))
    }, function(e, t, o) {
        e.exports = function(e) {
            return e.webpackPolyfill || (e.deprecate = function() {
            }, e.paths = [], e.children = [], e.webpackPolyfill = 1), e
        }
    }])
});
