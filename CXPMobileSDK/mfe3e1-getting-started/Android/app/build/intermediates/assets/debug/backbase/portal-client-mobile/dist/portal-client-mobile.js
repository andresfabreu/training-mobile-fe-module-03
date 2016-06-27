(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * !This is a stripped down version of Bunyan targeted specifically for the browser
 *
 * -------------------------------------------------------------------------------
 *
 * Copyright (c) 2014 Trent Mick. All rights reserved.
 * Copyright (c) 2014 Joyent Inc. All rights reserved.
 *
 * The bunyan logging library for node.js.
 *
 * -*- mode: js -*-
 * vim: expandtab:ts=4:sw=4
 */

'use strict';

var VERSION = '0.2.3';

// Bunyan log format version. This becomes the 'v' field on all log records.
// `0` is until I release a version '1.0.0' of node-bunyan. Thereafter,
// starting with `1`, this will be incremented if there is any backward
// incompatible change to the log record format. Details will be in
// 'CHANGES.md' (the change log).
var LOG_VERSION = 0;

//---- Internal support stuff

/**
 * A shallow copy of an object. Bunyan logging attempts to never cause
 * exceptions, so this function attempts to handle non-objects gracefully.
 */
function objCopy(obj) {
    if (typeof obj === 'undefined' || obj === null) {  // null or undefined
        return obj;
    } else if (Array.isArray(obj)) {
        return obj.slice();
    } else if (typeof (obj) === 'object') {
        var copy = {};
        Object.keys(obj).forEach(function (k) {
            copy[k] = obj[k];
        });
        return copy;
    } else {
        return obj;
    }
}

var format = function(f) {

    if(f === null) {
        return 'null';
    }

    if(typeof f !== 'string') {
        return f.toString();
    }
    var formatRegExp = /%[sdj%]/g;

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') {
            return '%';
        }
        if (i >= len) {
            return x;
        }
        switch (x) {
            case '%s': return String(args[i++]);
            case '%d': return Number(args[i++]);
            case '%j':
                try {
                    return JSON.stringify(args[i++]);
                } catch (_) {
                    return '[Circular]';
                }
                break;
            default:
                return x;
        }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
        str += ' ' + x;
    }
    return str;
};

/**
 * Gather some caller info 3 stack levels up.
 * See <http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi>.
 */
function getCaller3Info() {
    var obj = {};
    var saveLimit = Error.stackTraceLimit;
    var savePrepare = Error.prepareStackTrace;
    Error.stackTraceLimit = 3;
    //Error.captureStackTrace(this, getCaller3Info);

    Error.prepareStackTrace = function (_, stack) {
        var caller = stack[2];
        obj.file = caller.getFileName();
        obj.line = caller.getLineNumber();
        var func = caller.getFunctionName();
        if (func) {
            obj.func = func;
        }
    };
    Error.stackTraceLimit = saveLimit;
    Error.prepareStackTrace = savePrepare;
    return obj;
}


function _indent(s, indent) {
    if (!indent) {
        indent = '    ';
    }
    var lines = s.split(/\r?\n/g);
    return indent + lines.join('\n' + indent);
}


/**
 * Warn about an bunyan processing error.
 *
 * @param msg {String} Message with which to warn.
 * @param dedupKey {String} Optional. A short string key for this warning to
 *      have its warning only printed once.
 */
function _warn(msg, dedupKey) {
    if (dedupKey) {
        if (_warned[dedupKey]) {
            return;
        }
        _warned[dedupKey] = true;
    }
    console.error(msg + '\n');
}
function _haveWarned(dedupKey) {
    return _warned[dedupKey];
}
var _warned = {};


function ConsoleRawStream() {
}
ConsoleRawStream.prototype.write = function (rec) {
    if (rec.level < INFO) {
        console.log(rec);
    } else if (rec.level < WARN) {
        console.info(rec);
    } else if (rec.level < ERROR) {
        console.warn(rec);
    } else {
        console.error(rec);
    }

    if(rec.err && rec.err.stack) {
        console.error(rec.err.stack);
    }
};

function ConsoleFormattedStream() {}
ConsoleFormattedStream.prototype.write = function (rec) {

    var levelCss, defaultCss = 'color: DimGray', msgCss = 'color: SteelBlue';

    if (rec.level < DEBUG) {
        levelCss = 'color: DeepPink';
    } else if (rec.level < INFO) {
        levelCss = 'color: GoldenRod';
    } else if (rec.level < WARN) {
        levelCss = 'color: DarkTurquoise';
    } else if (rec.level < ERROR) {
        levelCss = 'color: Purple';
    } else if (rec.level < FATAL) {
        levelCss = 'color: Crimson';
    } else {
        levelCss = 'color: Black';
    }

    var loggerName = rec.childName ? rec.name + '/' + rec.childName : rec.name;

    //get level name and pad start with spacs
    var levelName = nameFromLevel[rec.level].toUpperCase();
    levelName = Array(6 - levelName.length).join(' ') + levelName;

    function padZeros(number, len) {
        return Array((len + 1) - (number + '').length).join('0') + number;
    }

    console.log('[%s:%s:%s:%s] %c%s%c: %s: %c%s',
        padZeros(rec.time.getHours(), 2), padZeros(rec.time.getMinutes(), 2),
        padZeros(rec.time.getSeconds(), 2), padZeros(rec.time.getMilliseconds(), 4),
        levelCss, levelName,
        defaultCss, loggerName,
        msgCss, rec.msg);
    if(rec.err && rec.err.stack) {
        console.log('%c%s,', levelCss, rec.err.stack);
    }
};

//---- Levels

var TRACE = 10;
var DEBUG = 20;
var INFO = 30;
var WARN = 40;
var ERROR = 50;
var FATAL = 60;

var levelFromName = {
    'trace': TRACE,
    'debug': DEBUG,
    'info': INFO,
    'warn': WARN,
    'error': ERROR,
    'fatal': FATAL
};
var nameFromLevel = {};
Object.keys(levelFromName).forEach(function (name) {
    nameFromLevel[levelFromName[name]] = name;
});


/**
 * Resolve a level number, name (upper or lowercase) to a level number value.
 *
 * @api public
 */
function resolveLevel(nameOrNum) {
    var level = (typeof (nameOrNum) === 'string' ? levelFromName[nameOrNum.toLowerCase()] : nameOrNum);
    return level;
}


//---- Logger class

/**
 * Create a Logger instance.
 *
 * @param options {Object} See documentation for full details. At minimum
 *    this must include a 'name' string key. Configuration keys:
 *      - `streams`: specify the logger output streams. This is an array of
 *        objects with these fields:
 *          - `type`: The stream type. See README.md for full details.
 *            Often this is implied by the other fields. Examples are
 *            'file', 'stream' and "raw".
 *          - `level`: Defaults to 'info'.
 *          - `path` or `stream`: The specify the file path or writeable
 *            stream to which log records are written. E.g.
 *            `stream: process.stdout`.
 *          - `closeOnExit` (boolean): Optional. Default is true for a
 *            'file' stream when `path` is given, false otherwise.
 *        See README.md for full details.
 *      - `level`: set the level for a single output stream (cannot be used
 *        with `streams`)
 *      - `stream`: the output stream for a logger with just one, e.g.
 *        `process.stdout` (cannot be used with `streams`)
 *      - `serializers`: object mapping log record field names to
 *        serializing functions. See README.md for details.
 *      - `src`: Boolean (default false). Set true to enable 'src' automatic
 *        field with log call source info.
 *    All other keys are log record fields.
 *
 * An alternative *internal* call signature is used for creating a child:
 *    new Logger(<parent logger>, <child options>[, <child opts are simple>]);
 *
 * @param _childSimple (Boolean) An assertion that the given `_childOptions`
 *    (a) only add fields (no config) and (b) no serialization handling is
 *    required for them. IOW, this is a fast path for frequent child
 *    creation.
 */
function Logger(options, _childOptions, _childSimple) {
    if (!(this instanceof Logger)) {
        return new Logger(options, _childOptions);
    }

    // Input arg validation.
    var parent;
    if (_childOptions !== undefined) {
        parent = options;
        options = _childOptions;
        if (!(parent instanceof Logger)) {
            throw new TypeError(
                'invalid Logger creation: do not pass a second arg');
        }
    }
    if (!options) {
        throw new TypeError('options (object) is required');
    }
    if (!parent) {
        if (!options.name) {
            throw new TypeError('options.name (string) is required');
        }
    } else {
        if (options.name) {
            throw new TypeError(
                'invalid options.name: child cannot set logger name');
        }
    }
    if (options.stream && options.streams) {
        throw new TypeError('cannot mix "streams" and "stream" options');
    }
    if (options.streams && !Array.isArray(options.streams)) {
        throw new TypeError('invalid options.streams: must be an array');
    }
    if (options.serializers && (typeof (options.serializers) !== 'object' || Array.isArray(options.serializers))) {
        throw new TypeError('invalid options.serializers: must be an object');
    }

    var fields, name, i;

    // Fast path for simple child creation.
    if (parent && _childSimple) {
        // `_isSimpleChild` is a signal to stream close handling that this child
        // owns none of its streams.
        this._isSimpleChild = true;

        this._level = parent._level;
        this.streams = parent.streams;
        this.serializers = parent.serializers;
        this.src = parent.src;
        fields = this.fields = {};
        var parentFieldNames = Object.keys(parent.fields);
        for (i = 0; i < parentFieldNames.length; i++) {
            name = parentFieldNames[i];
            fields[name] = parent.fields[name];
        }
        var names = Object.keys(options);
        for (i = 0; i < names.length; i++) {
            name = names[i];
            fields[name] = options[name];
        }
        return;
    }

    // Null values.
    var self = this;
    if (parent) {
        this._level = parent._level;
        this.streams = [];
        for (i = 0; i < parent.streams.length; i++) {
            var s = objCopy(parent.streams[i]);
            s.closeOnExit = false; // Don't own parent stream.
            this.streams.push(s);
        }
        this.serializers = objCopy(parent.serializers);
        this.src = parent.src;
        this.fields = objCopy(parent.fields);
        if (options.level) {
            this.level(options.level);
        }
    } else {
        this._level = Number.POSITIVE_INFINITY;
        this.streams = [];
        this.serializers = null;
        this.src = false;
        this.fields = {};
    }

    // Handle *config* options (i.e. options that are not just plain data
    // for log records).
    if (options.stream) {
        self.addStream({
            type: 'stream',
            stream: options.stream,
            closeOnExit: false,
            level: options.level
        });
    } else if (options.streams) {
        options.streams.forEach(function (s) {
            self.addStream(s, options.level);
        });
    } else if (parent && options.level) {
        this.level(options.level);
    } else if (!parent) {

        /*
         * In the browser we'll be emitting to console.log by default.
         * Any console.log worth its salt these days can nicely render
         * and introspect objects (e.g. the Firefox and Chrome console)
         * so let's emit the raw log record. Are there browsers for which
         * that breaks things?
         */
        self.addStream({
            type: 'raw',
            stream: new ConsoleRawStream(),
            closeOnExit: false,
            level: options.level
        });

    }
    if (options.serializers) {
        self.addSerializers(options.serializers);
    }
    if (options.src) {
        this.src = true;
    }

    // Fields.
    // These are the default fields for log records (minus the attributes
    // removed in this constructor). To allow storing raw log records
    // (unrendered), `this.fields` must never be mutated. Create a copy for
    // any changes.
    fields = objCopy(options);
    delete fields.stream;
    delete fields.level;
    delete fields.streams;
    delete fields.serializers;
    delete fields.src;
    if (this.serializers) {
        this._applySerializers(fields);
    }
    Object.keys(fields).forEach(function (k) {
        self.fields[k] = fields[k];
    });
}

/**
 * Add a stream
 *
 * @param stream {Object}. Object with these fields:
 *    - `type`: The stream type. See README.md for full details.
 *      Often this is implied by the other fields. Examples are
 *      'file', 'stream' and "raw".
 *    - `path` or `stream`: The specify the file path or writeable
 *      stream to which log records are written. E.g.
 *      `stream: process.stdout`.
 *    - `level`: Optional. Falls back to `defaultLevel`.
 *    - `closeOnExit` (boolean): Optional. Default is true for a
 *      'file' stream when `path` is given, false otherwise.
 *    See README.md for full details.
 * @param defaultLevel {Number|String} Optional. A level to use if
 *      `stream.level` is not set. If neither is given, this defaults to INFO.
 */
Logger.prototype.addStream = function addStream(s, defaultLevel) {
    var self = this;
    if (defaultLevel === null || defaultLevel === undefined) {
        defaultLevel = INFO;
    }

    s = objCopy(s);

    // Implicit 'type' from other args.
    if (!s.type && s.stream) {
        s.type = 'raw';
    }
    s.raw = (s.type === 'raw');  // PERF: Allow for faster check in `_emit`.

    if (s.level) {
        s.level = resolveLevel(s.level);
    } else {
        s.level = resolveLevel(defaultLevel);
    }
    if (s.level < self._level) {
        self._level = s.level;
    }

    switch (s.type) {
        case 'stream':
            if (!s.closeOnExit) {
                s.closeOnExit = false;
            }
            break;
        case 'raw':
            if (!s.closeOnExit) {
                s.closeOnExit = false;
            }
            break;
        default:
            throw new TypeError('unknown stream type "' + s.type + '"');
    }

    self.streams.push(s);
    delete self.haveNonRawStreams;  // reset
};


/**
 * Add serializers
 *
 * @param serializers {Object} Optional. Object mapping log record field names
 *    to serializing functions. See README.md for details.
 */
Logger.prototype.addSerializers = function addSerializers(serializers) {
    var self = this;

    if (!self.serializers) {
        self.serializers = {};
    }
    Object.keys(serializers).forEach(function (field) {
        var serializer = serializers[field];
        if (typeof (serializer) !== 'function') {
            throw new TypeError(format(
                'invalid serializer for "%s" field: must be a function',
                field));
        } else {
            self.serializers[field] = serializer;
        }
    });
};


/**
 * Create a child logger, typically to add a few log record fields.
 *
 * This can be useful when passing a logger to a sub-component, e.g. a
 * 'wuzzle' component of your service:
 *
 *    var wuzzleLog = log.child({component: 'wuzzle'})
 *    var wuzzle = new Wuzzle({..., log: wuzzleLog})
 *
 * Then log records from the wuzzle code will have the same structure as
 * the app log, *plus the component='wuzzle' field*.
 *
 * @param options {Object} Optional. Set of options to apply to the child.
 *    All of the same options for a new Logger apply here. Notes:
 *      - The parent's streams are inherited and cannot be removed in this
 *        call. Any given `streams` are *added* to the set inherited from
 *        the parent.
 *      - The parent's serializers are inherited, though can effectively be
 *        overwritten by using duplicate keys.
 *      - Can use `level` to set the level of the streams inherited from
 *        the parent. The level for the parent is NOT affected.
 * @param simple {Boolean} Optional. Set to true to assert that `options`
 *    (a) only add fields (no config) and (b) no serialization handling is
 *    required for them. IOW, this is a fast path for frequent child
 *    creation. See 'tools/timechild.js' for numbers.
 */
Logger.prototype.child = function (options, simple) {
    return new (this.constructor)(this, options || {}, simple);
};

/**
 * Get/set the level of all streams on this logger.
 *
 * Get Usage:
 *    // Returns the current log level (lowest level of all its streams).
 *    log.level() -> INFO
 *
 * Set Usage:
 *    log.level(INFO)       // set all streams to level INFO
 *    log.level('info')     // can use 'info' et al aliases
 */
Logger.prototype.level = function level(value) {
    if (value === undefined) {
        return this._level;
    }
    var newLevel = resolveLevel(value);
    var len = this.streams.length;
    for (var i = 0; i < len; i++) {
        this.streams[i].level = newLevel;
    }
    this._level = newLevel;
};


/**
 * Get/set the level of a particular stream on this logger.
 *
 * Get Usage:
 *    // Returns an array of the levels of each stream.
 *    log.levels() -> [TRACE, INFO]
 *
 *    // Returns a level of the identified stream.
 *    log.levels(0) -> TRACE      // level of stream at index 0
 *    log.levels('foo')           // level of stream with name 'foo'
 *
 * Set Usage:
 *    log.levels(0, INFO)         // set level of stream 0 to INFO
 *    log.levels(0, 'info')       // can use 'info' et al aliases
 *    log.levels('foo', WARN)     // set stream named 'foo' to WARN
 *
 * Stream names: When streams are defined, they can optionally be given
 * a name. For example,
 *       log = new Logger({
 *         streams: [
 *           {
 *             name: 'foo',
 *             path: '/var/log/my-service/foo.log'
 *             level: 'trace'
 *           },
 *         ...
 *
 * @param name {String|Number} The stream index or name.
 * @param value {Number|String} The level value (INFO) or alias ('info').
 *    If not given, this is a 'get' operation.
 * @throws {Error} If there is no stream with the given name.
 */
Logger.prototype.levels = function levels(name, value) {
    if (name === undefined) {
        return this.streams.map(
            function (s) {
                return s.level;
            });
    }
    var stream;
    if (typeof (name) === 'number') {
        stream = this.streams[name];
        if (stream === undefined) {
            throw new Error('invalid stream index: ' + name);
        }
    } else {
        var len = this.streams.length;
        for (var i = 0; i < len; i++) {
            var s = this.streams[i];
            if (s.name === name) {
                stream = s;
                break;
            }
        }
        if (!stream) {
            throw new Error(format('no stream with name "%s"', name));
        }
    }
    if (value === undefined) {
        return stream.level;
    } else {
        var newLevel = resolveLevel(value);
        stream.level = newLevel;
        if (newLevel < this._level) {
            this._level = newLevel;
        }
    }
};


/**
 * Apply registered serializers to the appropriate keys in the given fields.
 *
 * Pre-condition: This is only called if there is at least one serializer.
 *
 * @param fields (Object) The log record fields.
 * @param excludeFields (Object) Optional mapping of keys to `true` for
 *    keys to NOT apply a serializer.
 */
Logger.prototype._applySerializers = function (fields, excludeFields) {
    var self = this;

    // Check each serializer against these (presuming number of serializers
    // is typically less than number of fields).
    Object.keys(this.serializers).forEach(function (name) {
        if (fields[name] === undefined ||
            (excludeFields && excludeFields[name])) {
            return;
        }
        try {
            fields[name] = self.serializers[name](fields[name]);
        } catch (err) {
            _warn(format('bunyan: ERROR: Exception thrown from the "%s" ' +
                    'Bunyan serializer. This should never happen. This is a bug' +
                    'in that serializer function.\n%s',
                name, err.stack || err));
            fields[name] = format('(Error in Bunyan log "%s" serializer broke field. See stderr for details.)', name);
        }
    });
};


/**
 * Emit a log record.
 *
 * @param rec {log record}
 * @param noemit {Boolean} Optional. Set to true to skip emission
 *      and just return the JSON string.
 */
Logger.prototype._emit = function (rec, noemit) {
    var i;

    // Lazily determine if this Logger has non-'raw' streams. If there are
    // any, then we need to stringify the log record.
    if (this.haveNonRawStreams === undefined) {
        this.haveNonRawStreams = false;
        for (i = 0; i < this.streams.length; i++) {
            if (!this.streams[i].raw) {
                this.haveNonRawStreams = true;
                break;
            }
        }
    }

    // Stringify the object. Attempt to warn/recover on error.
    var str;
    if (noemit || this.haveNonRawStreams) {
        try {
            str = JSON.stringify(rec, safeCycles()) + '\n';
        } catch (e) {
            var dedupKey = e.stack.split(/\n/g, 2).join('\n');
            _warn('bunyan: ERROR: Exception in ' +
                    '`JSON.stringify(rec)`. You can install the ' +
                    '"safe-json-stringify" module to have Bunyan fallback ' +
                    'to safer stringification. Record:\n' +
                    _indent(format('%s\n%s', rec, e.stack)),
                dedupKey);
            str = format('(Exception in JSON.stringify(rec): %j. See stderr for details.)\n', e.message);

        }
    }

    if (noemit) {
        return str;
    }


    var level = rec.level;
    for (i = 0; i < this.streams.length; i++) {
        var s = this.streams[i];
        if (s.level <= level) {
            s.stream.write(s.raw ? rec : str);
        }
    }

    return str;
};


/**
 * Build a log emitter function for level minLevel. I.e. this is the
 * creator of `log.info`, `log.error`, etc.
 */
function mkLogEmitter(minLevel) {
    return function () {
        var log = this;

        function mkRecord(args) {
            var excludeFields;
            if (args[0] instanceof Error) {
                // `log.<level>(err, ...)`
                fields = {
                    // Use this Logger's err serializer, if defined.
                    err: (log.serializers && log.serializers.err ? log.serializers.err(args[0]) : Logger.stdSerializers.err(args[0]))
                };
                excludeFields = {err: true};
                if (args.length === 1) {
                    msgArgs = [fields.err.message];
                } else {
                    msgArgs = Array.prototype.slice.call(args, 1);
                }
            } else if (typeof (args[0]) !== 'object' && args[0] !== null ||
                Array.isArray(args[0])) {
                // `log.<level>(msg, ...)`
                fields = null;
                msgArgs = Array.prototype.slice.call(args);
            } else {  // `log.<level>(fields, msg, ...)`
                fields = args[0];
                msgArgs = Array.prototype.slice.call(args, 1);
            }

            // Build up the record object.
            var rec = objCopy(log.fields);
            rec.level = minLevel;
            var recFields = (fields ? objCopy(fields) : null);
            if (recFields) {
                if (log.serializers) {
                    log._applySerializers(recFields, excludeFields);
                }
                Object.keys(recFields).forEach(function (k) {
                    rec[k] = recFields[k];
                });
            }
            rec.levelName = nameFromLevel[minLevel];
            rec.msg = format.apply(log, msgArgs);
            if (!rec.time) {
                rec.time = (new Date());
            }
            // Get call source info
            if (log.src && !rec.src) {
                rec.src = getCaller3Info();
            }
            rec.v = LOG_VERSION;

            return rec;
        }

        var fields = null;
        var msgArgs = arguments;
        var rec = null;
        if (!this._emit) {
            /*
             * Show this invalid Bunyan usage warning *once*.
             *
             * See <https://github.com/trentm/node-bunyan/issues/100> for
             * an example of how this can happen.
             */
            var dedupKey = 'unbound';
            if (!_haveWarned[dedupKey]) {
                var caller = getCaller3Info();
                _warn(format('bunyan usage error: %s:%s: attempt to log with an unbound log method: `this` is: %s',
                        caller.file, caller.line, this.toString()),
                    dedupKey);
            }
            return;
        } else if (arguments.length === 0) {   // `log.<level>()`
            return (this._level <= minLevel);
        } else if (this._level > minLevel) {
            /* pass through */
        } else {
            rec = mkRecord(msgArgs);
            this._emit(rec);
        }
    };
}


/**
 * The functions below log a record at a specific level.
 *
 * Usages:
 *    log.<level>()  -> boolean is-trace-enabled
 *    log.<level>(<Error> err, [<string> msg, ...])
 *    log.<level>(<string> msg, ...)
 *    log.<level>(<object> fields, <string> msg, ...)
 *
 * where <level> is the lowercase version of the log level. E.g.:
 *
 *    log.info()
 *
 * @params fields {Object} Optional set of additional fields to log.
 * @params msg {String} Log message. This can be followed by additional
 *    arguments that are handled like
 *    [util.format](http://nodejs.org/docs/latest/api/all.html#util.format).
 */
Logger.prototype.trace = mkLogEmitter(TRACE);
Logger.prototype.debug = mkLogEmitter(DEBUG);
Logger.prototype.info = mkLogEmitter(INFO);
Logger.prototype.warn = mkLogEmitter(WARN);
Logger.prototype.error = mkLogEmitter(ERROR);
Logger.prototype.fatal = mkLogEmitter(FATAL);


//---- Standard serializers
// A serializer is a function that serializes a JavaScript object to a
// JSON representation for logging. There is a standard set of presumed
// interesting objects in node.js-land.

Logger.stdSerializers = {};

/*
 * This function dumps long stack traces for exceptions having a cause()
 * method. The error classes from
 * [verror](https://github.com/davepacheco/node-verror) and
 * [restify v2.0](https://github.com/mcavage/node-restify) are examples.
 *
 * Based on `dumpException` in
 * https://github.com/davepacheco/node-extsprintf/blob/master/lib/extsprintf.js
 */
function getFullErrorStack(ex) {
    var ret = ex.stack || ex.toString();
    if (ex.cause && typeof (ex.cause) === 'function') {
        var cex = ex.cause();
        if (cex) {
            ret += '\nCaused by: ' + getFullErrorStack(cex);
        }
    }
    return (ret);
}

// Serialize an Error object
// (Core error properties are enumerable in node 0.4, not in 0.6).
Logger.stdSerializers.err = function(err) {
    if (!err || !err.stack) {
        return err;
    }

    var obj = {
        message: err.message,
        name: err.name,
        stack: getFullErrorStack(err),
        code: err.code,
        signal: err.signal
    };
    return obj;
};


// A JSON stringifier that handles cycles safely.
// Usage: JSON.stringify(obj, safeCycles())
function safeCycles() {
    var seen = [];
    return function (key, val) {
        if (!val || typeof (val) !== 'object') {
            return val;
        }
        if (seen.indexOf(val) !== -1) {
            return '[Circular]';
        }
        seen.push(val);
        return val;
    };
}

//---- Exports

module.exports = Logger;

module.exports.TRACE = TRACE;
module.exports.DEBUG = DEBUG;
module.exports.INFO = INFO;
module.exports.WARN = WARN;
module.exports.ERROR = ERROR;
module.exports.FATAL = FATAL;
module.exports.resolveLevel = resolveLevel;
module.exports.levelFromName = levelFromName;
module.exports.nameFromLevel = nameFromLevel;

module.exports.VERSION = VERSION;
module.exports.LOG_VERSION = LOG_VERSION;

module.exports.createLogger = function createLogger(options) {
    return new Logger(options);
};

// Useful for custom `type == 'raw'` streams that may do JSON stringification
// of log records themselves. Usage:
//    var str = JSON.stringify(rec, bunyan.safeCycles());
module.exports.safeCycles = safeCycles;

//streams
module.exports.ConsoleFormattedStream = ConsoleFormattedStream;
module.exports.ConsoleRawStream = ConsoleRawStream;
},{}],2:[function(require,module,exports){
/*! (C) WebReflection - Mit Style License */
module.exports = function () {
  "use strict";

  var
    PREFIX = "@@",
    EventTarget = {},
    descriptor = {
      // in ES5 does not bother with enumeration
      configurable: true,
      value: null
    },
    defineProperty = Object.defineProperty ||
    function defineProperty(obj, prop, desc) {
      // in ES3 obj.hasOwnProperty() in for/in loops
      // is still mandatory since there's no way
      // to simulate non enumerable properties
      obj[prop] = desc.value;
    },
    indexOf = [].indexOf || function indexOf(value) {
      var i = this.length;
      while (i-- && this[i] !== value) {}
      return i;
    },
    has = EventTarget.hasOwnProperty;

  function configure(obj, prop, value) {
    descriptor.value = value;
    defineProperty(obj, prop, descriptor);
    descriptor.value = null;
  }

  function on(self, type, listener) {
    var array;
    if (has.call(self, type)) {
      array = self[type];
    } else {
      configure(self, type, array = []);
    }
    if (indexOf.call(array, listener) < 0) {
      array.push(listener);
    }
  }

  function dispatch(self, type, evt) {
    var array, current, i;
    if (has.call(self, type)) {
      evt.target = self;
      array = self[type].slice(0);
      for (i = 0; i < array.length; i++) {
        current = array[i];
        if (typeof current === "function") {
          current.call(self, evt);
        } else if (typeof current.handleEvent === "function") {
          current.handleEvent(evt);
        }
      }
    }
  }

  function off(self, type, listener) {
    var array, i;
    if (has.call(self, type)) {
      array = self[type];
      i = indexOf.call(array, listener);
      if (-1 < i) {
        array.splice(i, 1);
        if (!array.length) {
          delete self[type];
        }
      }
    }
  }

  configure(
    EventTarget,
    "addEventListener",
    function addEventListener(type, listener) {
      on(this, PREFIX + type, listener);
    }
  );

  configure(
    EventTarget,
    "dispatchEvent",
    function dispatchEvent(evt) {
      dispatch(this, PREFIX + evt.type, evt);
    }
  );

  configure(
    EventTarget,
    "removeEventListener",
    function removeEventListener(type, listener) {
      off(this, PREFIX + type, listener);
    }
  );

  return EventTarget;

}();
},{}],3:[function(require,module,exports){
'use strict';

var Handlebars = require('handlebars/dist/handlebars.min');

module.exports = {
    /**
     * Loop through a range of two integers inclusive
     * {{#range 1 10}}
     *   <li>Number: {{@index}}</li>
     * {{/range}}
     * @param {number} from An integer to loop from
     * @param {number} to An integer to loop to
     */
    range: function(from, to, options) {
        var accum = '';
        from = parseInt(from);
        to = parseInt(to);
        
        var data;

        if (options.data) {
            data = Handlebars.createFrame(options.data);
        }

        for(var i = from; i <= to; i++) {
            if (data) {
                data.index = i;
            }

            accum += options.fn({
                from: from,
                to: to
            }, { data: data });
        }
        return accum;
    },

    /**
     * Finds a preference by name and renders a block of HTML with that preference as a context
     * @example
     * {{#withPreference 'area' }}
     *  <!-- a preference with name 'area' becomes a context for block template -->
     * {{/withPreference}}
     * @param {string} name A name of a preference
     */
    withPreference: function(name, options) {
        if (this.preferences) {
            var preference = this.preferences.filter(function(pref) {
                return pref.name === name;
            })[0];

            return options.fn(preference);
        }
    },

    /**
     * Gets the value of a preference
     * {{ getPreferenceValue 'numColumns' }}
     * @param {string} name the name of the preference to get the value for
     * @returns {string} The preference's value
     */
    getPreferenceValue: function(name) {
        if(this.preferences) {
            var pref = this.preferences.filter(function(pref) {
                return pref.name === name;
            })[0];
            return pref ? pref.value : null;
        }
        return null;
    },

    /**
     * Adds two values together. Returns the largest integer less or equal to the result
     * `{{ add 5 5 }}` == 10
     * @param {number} v1
     * @param {number} v2
     * @returns {number}
     */
    add: function(v1, v2) {

        return Math.floor(parseFloat(v1) + parseFloat(v2));
    },

    /**
     * Subtracts one value from another. Returns the largest integer less or equal to the result
     * `{{ subtract 5 5 }}` == 10
     * @param {number} v1
     * @param {number} v2
     * @returns {number}
     */
    subtract: function(v1, v2) {

        return Math.floor(parseFloat(v1) - parseFloat(v2));
    },

    /***
     * Multiplies two values together. Returns the largest integer less or equal to the result
     * `{{multiply 5 5 }}` == 25
     * @param {number} v1
     * @param {number} v2
     * @returns {number}
     */
    multiply: function(v1, v2) {

        return Math.floor(parseFloat(v1) * parseFloat(v2));
    },

    /**
     * Divides one value by another. Returns the largest integer less or equal to the result
     *  `{{divide 25 5 }}` == 5
     * @param {{number}} v1
     * @param {{number}} v2
     * @returns {number}
     */
    divide: function(v1, v2) {

        return Math.floor(parseFloat(v1) / parseFloat(v2));
    },

    /**
     * Returns the integer remainder of dividing the two operands.
     *  `{{mod 12 5 }}` == 2
     * @param {{number}} v1
     * @param {{number}} v2
     * @returns {number}
     */
    mod: function(v1, v2) {

        return Math.floor(parseFloat(v1) % parseFloat(v2));
    },

    /**
     * Checks whether both parameters are identical (strictly equal)
     * @param {{any}} v1
     * @param {{any}} v2
     * @returns {Boolean}
     */
    equal: function (v1, v2) {
        return v1 === v2;
    },

    /**
     * Checks if the given one or more view hints exists in the property
     * @param {Array} viewHints Array of view hints
     * @param {String} name Name parameter can be more than one
     */
    hasViewHint: function () {
        var args = Array.prototype.slice.call(arguments);
        var options = args[args.length - 1];
        var names = args.slice(0, args.length - 1);

        for (var i = 0; i < names.length; i++) {
            if (this.viewhints && this.viewhints.indexOf(names[i]) >= 0) {
                return options.fn(this);
            }
        }

        return options.inverse(this);
    },

    /**
    * Gets viewhint value of given type
    * @param {String} viewhint type
    */
    getViewHint: function (viewHintType) {
        var viewHintsMap = {
            designmode: ['designModeOnly'],
            role: ['admin', 'manager', 'user', 'none'],
            input: ['text-input', 'checkbox', 'select-one'],
            order: []
        };

        if(!this.viewhints || !this.viewhints.length || !viewHintsMap[viewHintType]) {
            return null;
        }

        //look for matching value
        var matchedViewHint = this.viewhints.filter(function(viewHint) {
            return viewHintsMap[viewHintType].indexOf(viewHint) !== -1 || viewHint.slice(0, viewHintType.length) === viewHintType;
        })[0];

        //parse order number
        if (matchedViewHint && viewHintType === 'order') {
            var order = matchedViewHint.split('-');
            order = order.length === 2 ? order[1] : null;
            var parsedOrder = parseFloat(order);
            if (!isNaN(parsedOrder)) {
                order = parsedOrder;
            }
            matchedViewHint = order;
        }

        //set default values
        matchedViewHint = matchedViewHint || (viewHintType === 'input' ? 'text-input' : null);

        //convert to boolean if it's designmode view hint
        if(viewHintType === 'designmode') {
            matchedViewHint = !!matchedViewHint;
        }

        return matchedViewHint;
    },

    /**
     * Tests whether any of arguments passed have truthy value
     * @returns {Boolean} true if one of arguments is truthy, false otherwise.
     */
    or: function() {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).some(function (val) {
            return !!val;
        });
    },

    /**
     * Tests whether every argument passed has truthy value
     * @returns {Boolean} true if all arguments are truthy, false otherwise.
     */
    and: function() {
        return Array.prototype.slice.call(arguments, 0, arguments.length - 1).every(function (val) {
            return !!val;
        });
    },

    /**
     * Coerces argument to boolean type and inverts it
     * @param {*} value
     * @returns {boolean}
     */
    not: function(value) {
        return !value;
    },
    
    /**
     * Returns a configuration option value
     * @param {String} name configuration option
     * @returns {*}
     */
    getConfig: function (name, options) {
        var data = options.data;
        return data.cxpConfig ? data.cxpConfig[name] : undefined;
    },

    /**
     * Determines if an item is allowed to display the option to change to a given viewmode
     * @param {string} viewmode Is it possible to switch to this viewmode?
     * @returns {*|boolean}
     */
    allowViewmode:  function(viewmode, options) {
        var noneViewmode = 'none';
        var viewmodes = this.viewmodes || [];
        var targetViewmode = viewmode.toLowerCase();
        var currentViewmode = viewmodes[0] || noneViewmode;

        var transitionFound = false;
        var allowed = targetViewmode !== noneViewmode &&
            currentViewmode !== noneViewmode &&
            viewmodes.indexOf(targetViewmode) > -1 &&
            targetViewmode !== currentViewmode;

        if (allowed) {
            // possible transitions:
            var transitions = [
                ['windowed', 'maximized'],
                ['windowed', 'minimized'],
                ['windowed', 'fullscreen'],
                ['maximized', 'minimized'],
                ['maximized', 'fullscreen']
            ];

            transitionFound = transitions.some(function(pair) {
                return pair.indexOf(targetViewmode) > -1 && pair.indexOf(currentViewmode) > -1;
            });
        }

        //if the viewmode is not the current viewmode (first in array) and it is an accepted viewmode
        if(allowed && transitionFound) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },

    /**
     * Determines if an item has a given view mode
     * @param {string} viewmode A view mode to check for
     * @returns {*}
     */
    hasViewmode: function(viewmode, options) {
        var viewmodes = this.viewmodes || [];
        var givenViewmode = viewmode ? viewmode.toLowerCase() : '';

        return viewmodes.indexOf(givenViewmode) > -1 ?  options.fn(this) : options.inverse(this);
    },

    /**
     * Gets current (the first in the list) view mode of an item
     * @returns {String} Current view mode (if any) or "none" otherwise
     */
    currentViewmode: function() {
        return this.viewmodes && this.viewmodes.length ? this.viewmodes[0] : 'none';
    },

    /**
     * Runs then block if any of the preferences has viewhints
     */
    allowEdit: function(options) {
        if (!this.preferences || this.preferences.length <= 0) {
            return options.inverse(this);
        }

        //if any preferences have any viewhint
        var allowEdit = this.preferences.some(function(preference) {
            return preference.viewhints && preference.viewhints.length > 0;
        });

        if(allowEdit) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
};

},{"handlebars/dist/handlebars.min":27}],4:[function(require,module,exports){
/* jshint node:true */
'use strict';

// Add all locale data to `HandlebarsIntl`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

exports = module.exports = require('./lib/handlebars-intl');

},{"./lib/handlebars-intl":6,"./lib/locales":124}],5:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"Year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"month":{"displayName":"Month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"day":{"displayName":"Day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"Hour","relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"minute":{"displayName":"Minute","relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"second":{"displayName":"Second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}}}};


},{}],6:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

"use strict";
exports.__addLocaleData = __addLocaleData;
var intl$messageformat$$ = require("intl-messageformat"), intl$relativeformat$$ = require("intl-relativeformat"), src$helpers$$ = require("./helpers.js"), src$en$$ = require("./en.js");
function __addLocaleData(data) {
    intl$messageformat$$["default"].__addLocaleData(data);
    intl$relativeformat$$["default"].__addLocaleData(data);
}

__addLocaleData(src$en$$["default"]);
exports.registerWith = src$helpers$$.registerWith;


},{"./en.js":5,"./helpers.js":7,"intl-messageformat":12,"intl-relativeformat":21}],7:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

"use strict";
var intl$messageformat$$ = require("intl-messageformat"), intl$relativeformat$$ = require("intl-relativeformat"), intl$format$cache$$ = require("intl-format-cache"), src$utils$$ = require("./utils.js");

// -----------------------------------------------------------------------------

var getNumberFormat   = intl$format$cache$$["default"](Intl.NumberFormat);
var getDateTimeFormat = intl$format$cache$$["default"](Intl.DateTimeFormat);
var getMessageFormat  = intl$format$cache$$["default"](intl$messageformat$$["default"]);
var getRelativeFormat = intl$format$cache$$["default"](intl$relativeformat$$["default"]);

function registerWith(Handlebars) {
    var SafeString  = Handlebars.SafeString,
        createFrame = Handlebars.createFrame,
        escape      = Handlebars.Utils.escapeExpression;

    var helpers = {
        intl             : intl,
        intlGet          : intlGet,
        formatDate       : formatDate,
        formatTime       : formatTime,
        formatRelative   : formatRelative,
        formatNumber     : formatNumber,
        formatMessage    : formatMessage,
        formatHTMLMessage: formatHTMLMessage,

        // Deprecated helpers (renamed):
        intlDate       : deprecate('intlDate', formatDate),
        intlTime       : deprecate('intlTime', formatTime),
        intlNumber     : deprecate('intlNumber', formatNumber),
        intlMessage    : deprecate('intlMessage', formatMessage),
        intlHTMLMessage: deprecate('intlHTMLMessage', formatHTMLMessage)
    };

    for (var name in helpers) {
        if (helpers.hasOwnProperty(name)) {
            Handlebars.registerHelper(name, helpers[name]);
        }
    }

    function deprecate(name, suggestion) {
        return function () {
            if (typeof console !== 'undefined' &&
                typeof console.warn === 'function') {

                console.warn(
                    '{{' + name + '}} is deprecated, use: ' +
                    '{{' + suggestion.name + '}}'
                );
            }

            return suggestion.apply(this, arguments);
        };
    }

    // -- Helpers --------------------------------------------------------------

    function intl(options) {
        /* jshint validthis:true */

        if (!options.fn) {
            throw new Error('{{#intl}} must be invoked as a block helper');
        }

        // Create a new data frame linked the parent and create a new intl data
        // object and extend it with `options.data.intl` and `options.hash`.
        var data     = createFrame(options.data),
            intlData = src$utils$$.extend({}, data.intl, options.hash);

        data.intl = intlData;

        return options.fn(this, {data: data});
    }

    function intlGet(path, options) {
        var intlData  = options.data && options.data.intl,
            pathParts = path.split('.');

        var obj, len, i;

        // Use the path to walk the Intl data to find the object at the given
        // path, and throw a descriptive error if it's not found.
        try {
            for (i = 0, len = pathParts.length; i < len; i++) {
                obj = intlData = intlData[pathParts[i]];
            }
        } finally {
            if (obj === undefined) {
                throw new ReferenceError('Could not find Intl object: ' + path);
            }
        }

        return obj;
    }

    function formatDate(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatDate}}');

        if (!options) {
            options = format;
            format  = null;
        }

        var locales       = options.data.intl && options.data.intl.locales;
        var formatOptions = getFormatOptions('date', format, options);

        return getDateTimeFormat(locales, formatOptions).format(date);
    }

    function formatTime(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatTime}}');

        if (!options) {
            options = format;
            format  = null;
        }

        var locales       = options.data.intl && options.data.intl.locales;
        var formatOptions = getFormatOptions('time', format, options);

        return getDateTimeFormat(locales, formatOptions).format(date);
    }

    function formatRelative(date, format, options) {
        date = new Date(date);
        assertIsDate(date, 'A date or timestamp must be provided to {{formatRelative}}');

        if (!options) {
            options = format;
            format  = null;
        }

        var locales       = options.data.intl && options.data.intl.locales;
        var formatOptions = getFormatOptions('relative', format, options);
        var now           = options.hash.now;

        // Remove `now` from the options passed to the `IntlRelativeFormat`
        // constructor, because it's only used when calling `format()`.
        delete formatOptions.now;

        return getRelativeFormat(locales, formatOptions).format(date, {
            now: now
        });
    }

    function formatNumber(num, format, options) {
        assertIsNumber(num, 'A number must be provided to {{formatNumber}}');

        if (!options) {
            options = format;
            format  = null;
        }

        var locales       = options.data.intl && options.data.intl.locales;
        var formatOptions = getFormatOptions('number', format, options);

        return getNumberFormat(locales, formatOptions).format(num);
    }

    function formatMessage(message, options) {
        if (!options) {
            options = message;
            message = null;
        }

        var hash = options.hash;

        // TODO: remove support form `hash.intlName` once Handlebars bugs with
        // subexpressions are fixed.
        if (!(message || typeof message === 'string' || hash.intlName)) {
            throw new ReferenceError(
                '{{formatMessage}} must be provided a message or intlName'
            );
        }

        var intlData = options.data.intl || {},
            locales  = intlData.locales,
            formats  = intlData.formats;

        // Lookup message by path name. User must supply the full path to the
        // message on `options.data.intl`.
        if (!message && hash.intlName) {
            message = intlGet(hash.intlName, options);
        }

        // When `message` is a function, assume it's an IntlMessageFormat
        // instance's `format()` method passed by reference, and call it. This
        // is possible because its `this` will be pre-bound to the instance.
        if (typeof message === 'function') {
            return message(hash);
        }

        if (typeof message === 'string') {
            message = getMessageFormat(message, locales, formats);
        }

        return message.format(hash);
    }

    function formatHTMLMessage() {
        /* jshint validthis:true */
        var options = [].slice.call(arguments).pop(),
            hash    = options.hash;

        var key, value;

        // Replace string properties in `options.hash` with HTML-escaped
        // strings.
        for (key in hash) {
            if (hash.hasOwnProperty(key)) {
                value = hash[key];

                // Escape string value.
                if (typeof value === 'string') {
                    hash[key] = escape(value);
                }
            }
        }

        // Return a Handlebars `SafeString`. This first unwraps the result to
        // make sure it's not returning a double-wrapped `SafeString`.
        return new SafeString(String(formatMessage.apply(this, arguments)));
    }

    // -- Utilities ------------------------------------------------------------

    function assertIsDate(date, errMsg) {
        // Determine if the `date` is valid by checking if it is finite, which
        // is the same way that `Intl.DateTimeFormat#format()` checks.
        if (!isFinite(date)) {
            throw new TypeError(errMsg);
        }
    }

    function assertIsNumber(num, errMsg) {
        if (typeof num !== 'number') {
            throw new TypeError(errMsg);
        }
    }

    function getFormatOptions(type, format, options) {
        var hash = options.hash;
        var formatOptions;

        if (format) {
            if (typeof format === 'string') {
                formatOptions = intlGet('formats.' + type + '.' + format, options);
            }

            formatOptions = src$utils$$.extend({}, formatOptions, hash);
        } else {
            formatOptions = hash;
        }

        return formatOptions;
    }
}
exports.registerWith = registerWith;


},{"./utils.js":8,"intl-format-cache":9,"intl-messageformat":12,"intl-relativeformat":21}],8:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

"use strict";

// -----------------------------------------------------------------------------

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (source.hasOwnProperty(key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.extend = extend;


},{}],9:[function(require,module,exports){
'use strict';

exports = module.exports = require('./lib/memoizer')['default'];
exports['default'] = exports;

},{"./lib/memoizer":11}],10:[function(require,module,exports){
"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Function.prototype.bind implementation from Mozilla Developer Network:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill

var bind = Function.prototype.bind || function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
};

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var hop = Object.prototype.hasOwnProperty;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.bind = bind, exports.defineProperty = defineProperty, exports.objCreate = objCreate;


},{}],11:[function(require,module,exports){
"use strict";
var src$es5$$ = require("./es5");
exports["default"] = createFormatCache;

// -----------------------------------------------------------------------------

function createFormatCache(FormatConstructor) {
    var cache = src$es5$$.objCreate(null);

    return function () {
        var args    = Array.prototype.slice.call(arguments);
        var cacheId = getCacheId(args);
        var format  = cacheId && cache[cacheId];

        if (!format) {
            format = new (src$es5$$.bind.apply(FormatConstructor, [null].concat(args)))();

            if (cacheId) {
                cache[cacheId] = format;
            }
        }

        return format;
    };
}

// -- Utilities ----------------------------------------------------------------

function getCacheId(inputs) {
    // When JSON is not available in the runtime, we will not create a cache id.
    if (typeof JSON === 'undefined') { return; }

    var cacheId = [];

    var i, len, input;

    for (i = 0, len = inputs.length; i < len; i += 1) {
        input = inputs[i];

        if (input && typeof input === 'object') {
            cacheId.push(orderedProps(input));
        } else {
            cacheId.push(input);
        }
    }

    return JSON.stringify(cacheId);
}

function orderedProps(obj) {
    var props = [],
        keys  = [];

    var key, i, len, prop;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    var orderedKeys = keys.sort();

    for (i = 0, len = orderedKeys.length; i < len; i += 1) {
        key  = orderedKeys[i];
        prop = {};

        prop[key] = obj[key];
        props[i]  = prop;
    }

    return props;
}


},{"./es5":10}],12:[function(require,module,exports){
/* jshint node:true */

'use strict';

var IntlMessageFormat = require('./lib/main')['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;

},{"./lib/locales":124,"./lib/main":17}],13:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
exports["default"] = Compiler;

function Compiler(locales, formats, pluralFn) {
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
        element = elements[i];

        switch (element.type) {
            case 'messageTextElement':
                pattern.push(this.compileMessageText(element));
                break;

            case 'argumentElement':
                pattern.push(this.compileArgument(element));
                break;

            default:
                throw new Error('Message element does not have a valid type');
        }
    }

    return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
        if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
        }

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
        option = options[i];

        // Compile the sub-pattern and save it under the options's selector.
        optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
};

// -- Compiler Helper Classes --------------------------------------------------

function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value) {
        return '';
    }

    return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};


},{}],14:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var src$utils$$ = require("./utils"), src$es5$$ = require("./es5"), src$compiler$$ = require("./compiler"), intl$messageformat$parser$$ = require("intl-messageformat-parser");
exports["default"] = MessageFormat;

// -- MessageFormat --------------------------------------------------------

function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
        return messageFormat._format(pattern, values);
    };
}

// Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.
src$es5$$.defineProperty(MessageFormat, 'formats', {
    enumerable: true,

    value: {
        number: {
            'currency': {
                style: 'currency'
            },

            'percent': {
                style: 'percent'
            }
        },

        date: {
            'short': {
                month: 'numeric',
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
        locale: this._locale
    };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
    return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value;

    for (i = 0, len = pattern.length; i < len; i += 1) {
        part = pattern[i];

        // Exist early for string parts.
        if (typeof part === 'string') {
            result += part;
            continue;
        }

        id = part.id;

        // Enforce that all required values are provided by the caller.
        if (!(values && src$utils$$.hop.call(values, id))) {
            throw new Error('A value must be provided for: ' + id);
        }

        value = values[id];

        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (part.options) {
            result += this._format(part.getOption(value), values);
        } else {
            result += part.format(value);
        }
    }

    return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type, mergedType;

    for (type in defaults) {
        if (!src$utils$$.hop.call(defaults, type)) { continue; }

        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

        if (formats && src$utils$$.hop.call(formats, type)) {
            src$utils$$.extend(mergedType, formats[type]);
        }
    }

    return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};


},{"./compiler":13,"./es5":16,"./utils":18,"intl-messageformat-parser":19}],15:[function(require,module,exports){
// GENERATED FILE
"use strict";
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};


},{}],16:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var src$utils$$ = require("./utils");

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (src$utils$$.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};
exports.defineProperty = defineProperty, exports.objCreate = objCreate;


},{"./utils":18}],17:[function(require,module,exports){
/* jslint esnext: true */

"use strict";
var src$core$$ = require("./core"), src$en$$ = require("./en");

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];


},{"./core":14,"./en":15}],18:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
exports.extend = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.hop = hop;


},{}],19:[function(require,module,exports){
'use strict';

exports = module.exports = require('./lib/parser')['default'];
exports['default'] = exports;

},{"./lib/parser":20}],20:[function(require,module,exports){
"use strict";

exports["default"] = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements
                };
            },
        peg$c2 = peg$FAILED,
        peg$c3 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c4 = function(messageText) {
                return {
                    type : 'messageTextElement',
                    value: messageText
                };
            },
        peg$c5 = /^[^ \t\n\r,.+={}#]/,
        peg$c6 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c7 = "{",
        peg$c8 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c9 = null,
        peg$c10 = ",",
        peg$c11 = { type: "literal", value: ",", description: "\",\"" },
        peg$c12 = "}",
        peg$c13 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c14 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
                    format: format && format[2]
                };
            },
        peg$c15 = "number",
        peg$c16 = { type: "literal", value: "number", description: "\"number\"" },
        peg$c17 = "date",
        peg$c18 = { type: "literal", value: "date", description: "\"date\"" },
        peg$c19 = "time",
        peg$c20 = { type: "literal", value: "time", description: "\"time\"" },
        peg$c21 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2]
                };
            },
        peg$c22 = "plural",
        peg$c23 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options
                };
            },
        peg$c25 = "selectordinal",
        peg$c26 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c27 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options
                }
            },
        peg$c28 = "select",
        peg$c29 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c30 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options
                };
            },
        peg$c31 = "=",
        peg$c32 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c33 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern
                };
            },
        peg$c34 = "offset:",
        peg$c35 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c36 = function(number) {
                return number;
            },
        peg$c37 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
                    options: options
                };
            },
        peg$c38 = { type: "other", description: "whitespace" },
        peg$c39 = /^[ \t\n\r]/,
        peg$c40 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c41 = { type: "other", description: "optionalWhitespace" },
        peg$c42 = /^[0-9]/,
        peg$c43 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c44 = /^[0-9a-f]/i,
        peg$c45 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c46 = "0",
        peg$c47 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c48 = /^[1-9]/,
        peg$c49 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c50 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c51 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c52 = { type: "class", value: "[^{}\\\\\\0-\\x1F \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F \\t\\n\\r]" },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function() { return '\\#'; },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function() { return '\u007B'; },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function() { return '\u007D'; },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c65 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;

      s0 = peg$parsemessageTextElement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c2;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c3(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemessageText();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c4(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;

      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c5.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c5.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
          }
        } else {
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          s1 = input.substring(s0, peg$currPos);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c10;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();
                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c2;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c2;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c2;
              }
              if (s5 === peg$FAILED) {
                s5 = peg$c9;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c12;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c14(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;

      s0 = peg$parsesimpleFormat();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c17) {
          s1 = peg$c17;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c19) {
            s1 = peg$c19;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c10;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c2;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c9;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c21(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c28) {
        s1 = peg$c28;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$c2;
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c30(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c31;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c7;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c12;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c13); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c33(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c34) {
        s1 = peg$c34;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c36(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseoffset();
      if (s1 === peg$FAILED) {
        s1 = peg$c9;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$c2;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c37(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c39.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c39.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
          }
        }
      } else {
        s0 = peg$c2;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }
      if (s1 !== peg$FAILED) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c42.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c44.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c46;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c48.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          s2 = input.substring(s1, peg$currPos);
        }
        s1 = s2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c50(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c51.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c53) {
          s1 = peg$c53;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c55();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c56) {
            s1 = peg$c56;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c57); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c58();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c59) {
              s1 = peg$c59;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c61();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c62) {
                s1 = peg$c62;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c63); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$currPos;
                s4 = peg$parsehexDigit();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsehexDigit();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parsehexDigit();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parsehexDigit();
                      if (s7 !== peg$FAILED) {
                        s4 = [s4, s5, s6, s7];
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$c2;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c2;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c2;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c2;
                }
                if (s3 !== peg$FAILED) {
                  s3 = input.substring(s2, peg$currPos);
                }
                s2 = s3;
                if (s2 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c64(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c65(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();


},{}],21:[function(require,module,exports){
/* jshint node:true */

'use strict';

var IntlRelativeFormat = require('./lib/main')['default'];

// Add all locale data to `IntlRelativeFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlRelativeFormat;
exports['default'] = exports;

},{"./lib/locales":124,"./lib/main":26}],22:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";
var intl$messageformat$$ = require("intl-messageformat"), src$diff$$ = require("./diff"), src$es5$$ = require("./es5");
exports["default"] = RelativeFormat;

// -----------------------------------------------------------------------------

var FIELDS = ['second', 'minute', 'hour', 'day', 'month', 'year'];
var STYLES = ['best fit', 'numeric'];

// -- RelativeFormat -----------------------------------------------------------

function RelativeFormat(locales, options) {
    options = options || {};

    // Make a copy of `locales` if it's an array, so that it doesn't change
    // since it's used lazily.
    if (src$es5$$.isArray(locales)) {
        locales = locales.concat();
    }

    src$es5$$.defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
    src$es5$$.defineProperty(this, '_options', {value: {
        style: this._resolveStyle(options.style),
        units: this._isValidUnits(options.units) && options.units
    }});

    src$es5$$.defineProperty(this, '_locales', {value: locales});
    src$es5$$.defineProperty(this, '_fields', {value: this._findFields(this._locale)});
    src$es5$$.defineProperty(this, '_messages', {value: src$es5$$.objCreate(null)});

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var relativeFormat = this;
    this.format = function format(date, options) {
        return relativeFormat._format(date, options);
    };
}

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(RelativeFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(RelativeFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlRelativeFormat is missing a ' +
            '`locale` property value'
        );
    }

    RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

    // Add data to IntlMessageFormat.
    intl$messageformat$$["default"].__addLocaleData(data);
}});

// Define public `defaultLocale` property which can be set by the developer, or
// it will be set when the first RelativeFormat instance is created by
// leveraging the resolved locale from `Intl`.
src$es5$$.defineProperty(RelativeFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

// Define public `thresholds` property which can be set by the developer, and
// defaults to relative time thresholds from moment.js.
src$es5$$.defineProperty(RelativeFormat, 'thresholds', {
    enumerable: true,

    value: {
        second: 45,  // seconds to minute
        minute: 45,  // minutes to hour
        hour  : 22,  // hours to day
        day   : 26,  // days to month
        month : 11   // months to year
    }
});

RelativeFormat.prototype.resolvedOptions = function () {
    return {
        locale: this._locale,
        style : this._options.style,
        units : this._options.units
    };
};

RelativeFormat.prototype._compileMessage = function (units) {
    // `this._locales` is the original set of locales the user specified to the
    // constructor, while `this._locale` is the resolved root locale.
    var locales        = this._locales;
    var resolvedLocale = this._locale;

    var field        = this._fields[units];
    var relativeTime = field.relativeTime;
    var future       = '';
    var past         = '';
    var i;

    for (i in relativeTime.future) {
        if (relativeTime.future.hasOwnProperty(i)) {
            future += ' ' + i + ' {' +
                relativeTime.future[i].replace('{0}', '#') + '}';
        }
    }

    for (i in relativeTime.past) {
        if (relativeTime.past.hasOwnProperty(i)) {
            past += ' ' + i + ' {' +
                relativeTime.past[i].replace('{0}', '#') + '}';
        }
    }

    var message = '{when, select, future {{0, plural, ' + future + '}}' +
                                 'past {{0, plural, ' + past + '}}}';

    // Create the synthetic IntlMessageFormat instance using the original
    // locales value specified by the user when constructing the the parent
    // IntlRelativeFormat instance.
    return new intl$messageformat$$["default"](message, locales);
};

RelativeFormat.prototype._getMessage = function (units) {
    var messages = this._messages;

    // Create a new synthetic message based on the locale data from CLDR.
    if (!messages[units]) {
        messages[units] = this._compileMessage(units);
    }

    return messages[units];
};

RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
    var field = this._fields[units];

    if (field.relative) {
        return field.relative[diff];
    }
};

RelativeFormat.prototype._findFields = function (locale) {
    var localeData = RelativeFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find `fields` to return.
    while (data) {
        if (data.fields) {
            return data.fields;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlRelativeFormat is missing `fields` for :' +
        locale
    );
};

RelativeFormat.prototype._format = function (date, options) {
    var now = options && options.now !== undefined ? options.now : src$es5$$.dateNow();

    if (date === undefined) {
        date = now;
    }

    // Determine if the `date` and optional `now` values are valid, and throw a
    // similar error to what `Intl.DateTimeFormat#format()` would throw.
    if (!isFinite(now)) {
        throw new RangeError(
            'The `now` option provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    if (!isFinite(date)) {
        throw new RangeError(
            'The date value provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    var diffReport  = src$diff$$["default"](now, date);
    var units       = this._options.units || this._selectUnits(diffReport);
    var diffInUnits = diffReport[units];

    if (this._options.style !== 'numeric') {
        var relativeUnits = this._getRelativeUnits(diffInUnits, units);
        if (relativeUnits) {
            return relativeUnits;
        }
    }

    return this._getMessage(units).format({
        '0' : Math.abs(diffInUnits),
        when: diffInUnits < 0 ? 'past' : 'future'
    });
};

RelativeFormat.prototype._isValidUnits = function (units) {
    if (!units || src$es5$$.arrIndexOf.call(FIELDS, units) >= 0) {
        return true;
    }

    if (typeof units === 'string') {
        var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
        if (suggestion && src$es5$$.arrIndexOf.call(FIELDS, suggestion) >= 0) {
            throw new Error(
                '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
                'value, did you mean: ' + suggestion
            );
        }
    }

    throw new Error(
        '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
        'must be one of: "' + FIELDS.join('", "') + '"'
    );
};

RelativeFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(RelativeFormat.defaultLocale);

    var localeData = RelativeFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlRelativeFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

RelativeFormat.prototype._resolveStyle = function (style) {
    // Default to "best fit" style.
    if (!style) {
        return STYLES[0];
    }

    if (src$es5$$.arrIndexOf.call(STYLES, style) >= 0) {
        return style;
    }

    throw new Error(
        '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
        'must be one of: "' + STYLES.join('", "') + '"'
    );
};

RelativeFormat.prototype._selectUnits = function (diffReport) {
    var i, l, units;

    for (i = 0, l = FIELDS.length; i < l; i += 1) {
        units = FIELDS[i];

        if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
            break;
        }
    }

    return units;
};


},{"./diff":23,"./es5":25,"intl-messageformat":12}],23:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";

var round = Math.round;

function daysToYears(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 400 / 146097;
}

exports["default"] = function (from, to) {
    // Convert to ms timestamps.
    from = +from;
    to   = +to;

    var millisecond = round(to - from),
        second      = round(millisecond / 1000),
        minute      = round(second / 60),
        hour        = round(minute / 60),
        day         = round(hour / 24),
        week        = round(day / 7);

    var rawYears = daysToYears(day),
        month    = round(rawYears * 12),
        year     = round(rawYears);

    return {
        millisecond: millisecond,
        second     : second,
        minute     : minute,
        hour       : hour,
        day        : day,
        week       : week,
        month      : month,
        year       : year
    };
};


},{}],24:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],25:[function(require,module,exports){
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

"use strict";

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var hop = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
    /*jshint validthis:true */
    var arr = this;
    if (!arr.length) {
        return -1;
    }

    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
        if (arr[i] === search) {
            return i;
        }
    }

    return -1;
};

var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

var dateNow = Date.now || function () {
    return new Date().getTime();
};
exports.defineProperty = defineProperty, exports.objCreate = objCreate, exports.arrIndexOf = arrIndexOf, exports.isArray = isArray, exports.dateNow = dateNow;


},{}],26:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./core":22,"./en":24,"dup":17}],27:[function(require,module,exports){
/*!

 handlebars v3.0.3

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
!function(a,b){"object"==typeof exports&&"object"==typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):"object"==typeof exports?exports.Handlebars=b():a.Handlebars=b()}(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){"use strict";function d(){var a=r();return a.compile=function(b,c){return k.compile(b,c,a)},a.precompile=function(b,c){return k.precompile(b,c,a)},a.AST=i["default"],a.Compiler=k.Compiler,a.JavaScriptCompiler=m["default"],a.Parser=j.parser,a.parse=j.parse,a}var e=c(8)["default"];b.__esModule=!0;var f=c(1),g=e(f),h=c(2),i=e(h),j=c(3),k=c(4),l=c(5),m=e(l),n=c(6),o=e(n),p=c(7),q=e(p),r=g["default"].create,s=d();s.create=d,q["default"](s),s.Visitor=o["default"],s["default"]=s,b["default"]=s,a.exports=b["default"]},function(a,b,c){"use strict";function d(){var a=new g.HandlebarsEnvironment;return m.extend(a,g),a.SafeString=i["default"],a.Exception=k["default"],a.Utils=m,a.escapeExpression=m.escapeExpression,a.VM=o,a.template=function(b){return o.template(b,a)},a}var e=c(8)["default"];b.__esModule=!0;var f=c(9),g=e(f),h=c(10),i=e(h),j=c(11),k=e(j),l=c(12),m=e(l),n=c(13),o=e(n),p=c(7),q=e(p),r=d();r.create=d,q["default"](r),r["default"]=r,b["default"]=r,a.exports=b["default"]},function(a,b){"use strict";b.__esModule=!0;var c={Program:function(a,b,c,d){this.loc=d,this.type="Program",this.body=a,this.blockParams=b,this.strip=c},MustacheStatement:function(a,b,c,d,e,f){this.loc=f,this.type="MustacheStatement",this.path=a,this.params=b||[],this.hash=c,this.escaped=d,this.strip=e},BlockStatement:function(a,b,c,d,e,f,g,h,i){this.loc=i,this.type="BlockStatement",this.path=a,this.params=b||[],this.hash=c,this.program=d,this.inverse=e,this.openStrip=f,this.inverseStrip=g,this.closeStrip=h},PartialStatement:function(a,b,c,d,e){this.loc=e,this.type="PartialStatement",this.name=a,this.params=b||[],this.hash=c,this.indent="",this.strip=d},ContentStatement:function(a,b){this.loc=b,this.type="ContentStatement",this.original=this.value=a},CommentStatement:function(a,b,c){this.loc=c,this.type="CommentStatement",this.value=a,this.strip=b},SubExpression:function(a,b,c,d){this.loc=d,this.type="SubExpression",this.path=a,this.params=b||[],this.hash=c},PathExpression:function(a,b,c,d,e){this.loc=e,this.type="PathExpression",this.data=a,this.original=d,this.parts=c,this.depth=b},StringLiteral:function(a,b){this.loc=b,this.type="StringLiteral",this.original=this.value=a},NumberLiteral:function(a,b){this.loc=b,this.type="NumberLiteral",this.original=this.value=Number(a)},BooleanLiteral:function(a,b){this.loc=b,this.type="BooleanLiteral",this.original=this.value="true"===a},UndefinedLiteral:function(a){this.loc=a,this.type="UndefinedLiteral",this.original=this.value=void 0},NullLiteral:function(a){this.loc=a,this.type="NullLiteral",this.original=this.value=null},Hash:function(a,b){this.loc=b,this.type="Hash",this.pairs=a},HashPair:function(a,b,c){this.loc=c,this.type="HashPair",this.key=a,this.value=b},helpers:{helperExpression:function(a){return!("SubExpression"!==a.type&&!a.params.length&&!a.hash)},scopedId:function(a){return/^\.|this\b/.test(a.original)},simpleId:function(a){return 1===a.parts.length&&!c.helpers.scopedId(a)&&!a.depth}}};b["default"]=c,a.exports=b["default"]},function(a,b,c){"use strict";function d(a,b){if("Program"===a.type)return a;g["default"].yy=o,o.locInfo=function(a){return new o.SourceLocation(b&&b.srcName,a)};var c=new k["default"];return c.accept(g["default"].parse(a))}var e=c(8)["default"];b.__esModule=!0,b.parse=d;var f=c(14),g=e(f),h=c(2),i=e(h),j=c(15),k=e(j),l=c(16),m=e(l),n=c(12);b.parser=g["default"];var o={};n.extend(o,m,i["default"])},function(a,b,c){"use strict";function d(){}function e(a,b,c){if(null==a||"string"!=typeof a&&"Program"!==a.type)throw new k["default"]("You must pass a string or Handlebars AST to Handlebars.precompile. You passed "+a);b=b||{},"data"in b||(b.data=!0),b.compat&&(b.useDepths=!0);var d=c.parse(a,b),e=(new c.Compiler).compile(d,b);return(new c.JavaScriptCompiler).compile(e,b)}function f(a,b,c){function d(){var b=c.parse(a,f),d=(new c.Compiler).compile(b,f),e=(new c.JavaScriptCompiler).compile(d,f,void 0,!0);return c.template(e)}function e(a,b){return g||(g=d()),g.call(this,a,b)}var f=void 0===arguments[1]?{}:arguments[1];if(null==a||"string"!=typeof a&&"Program"!==a.type)throw new k["default"]("You must pass a string or Handlebars AST to Handlebars.compile. You passed "+a);"data"in f||(f.data=!0),f.compat&&(f.useDepths=!0);var g=void 0;return e._setup=function(a){return g||(g=d()),g._setup(a)},e._child=function(a,b,c,e){return g||(g=d()),g._child(a,b,c,e)},e}function g(a,b){if(a===b)return!0;if(l.isArray(a)&&l.isArray(b)&&a.length===b.length){for(var c=0;c<a.length;c++)if(!g(a[c],b[c]))return!1;return!0}}function h(a){if(!a.path.parts){var b=a.path;a.path=new n["default"].PathExpression(!1,0,[b.original+""],b.original+"",b.loc)}}var i=c(8)["default"];b.__esModule=!0,b.Compiler=d,b.precompile=e,b.compile=f;var j=c(11),k=i(j),l=c(12),m=c(2),n=i(m),o=[].slice;d.prototype={compiler:d,equals:function(a){var b=this.opcodes.length;if(a.opcodes.length!==b)return!1;for(var c=0;b>c;c++){var d=this.opcodes[c],e=a.opcodes[c];if(d.opcode!==e.opcode||!g(d.args,e.args))return!1}b=this.children.length;for(var c=0;b>c;c++)if(!this.children[c].equals(a.children[c]))return!1;return!0},guid:0,compile:function(a,b){this.sourceNode=[],this.opcodes=[],this.children=[],this.options=b,this.stringParams=b.stringParams,this.trackIds=b.trackIds,b.blockParams=b.blockParams||[];var c=b.knownHelpers;if(b.knownHelpers={helperMissing:!0,blockHelperMissing:!0,each:!0,"if":!0,unless:!0,"with":!0,log:!0,lookup:!0},c)for(var d in c)d in c&&(b.knownHelpers[d]=c[d]);return this.accept(a)},compileProgram:function(a){var b=new this.compiler,c=b.compile(a,this.options),d=this.guid++;return this.usePartial=this.usePartial||c.usePartial,this.children[d]=c,this.useDepths=this.useDepths||c.useDepths,d},accept:function(a){this.sourceNode.unshift(a);var b=this[a.type](a);return this.sourceNode.shift(),b},Program:function(a){this.options.blockParams.unshift(a.blockParams);for(var b=a.body,c=b.length,d=0;c>d;d++)this.accept(b[d]);return this.options.blockParams.shift(),this.isSimple=1===c,this.blockParams=a.blockParams?a.blockParams.length:0,this},BlockStatement:function(a){h(a);var b=a.program,c=a.inverse;b=b&&this.compileProgram(b),c=c&&this.compileProgram(c);var d=this.classifySexpr(a);"helper"===d?this.helperSexpr(a,b,c):"simple"===d?(this.simpleSexpr(a),this.opcode("pushProgram",b),this.opcode("pushProgram",c),this.opcode("emptyHash"),this.opcode("blockValue",a.path.original)):(this.ambiguousSexpr(a,b,c),this.opcode("pushProgram",b),this.opcode("pushProgram",c),this.opcode("emptyHash"),this.opcode("ambiguousBlockValue")),this.opcode("append")},PartialStatement:function(a){this.usePartial=!0;var b=a.params;if(b.length>1)throw new k["default"]("Unsupported number of partial arguments: "+b.length,a);b.length||b.push({type:"PathExpression",parts:[],depth:0});var c=a.name.original,d="SubExpression"===a.name.type;d&&this.accept(a.name),this.setupFullMustacheParams(a,void 0,void 0,!0);var e=a.indent||"";this.options.preventIndent&&e&&(this.opcode("appendContent",e),e=""),this.opcode("invokePartial",d,c,e),this.opcode("append")},MustacheStatement:function(a){this.SubExpression(a),this.opcode(a.escaped&&!this.options.noEscape?"appendEscaped":"append")},ContentStatement:function(a){a.value&&this.opcode("appendContent",a.value)},CommentStatement:function(){},SubExpression:function(a){h(a);var b=this.classifySexpr(a);"simple"===b?this.simpleSexpr(a):"helper"===b?this.helperSexpr(a):this.ambiguousSexpr(a)},ambiguousSexpr:function(a,b,c){var d=a.path,e=d.parts[0],f=null!=b||null!=c;this.opcode("getContext",d.depth),this.opcode("pushProgram",b),this.opcode("pushProgram",c),this.accept(d),this.opcode("invokeAmbiguous",e,f)},simpleSexpr:function(a){this.accept(a.path),this.opcode("resolvePossibleLambda")},helperSexpr:function(a,b,c){var d=this.setupFullMustacheParams(a,b,c),e=a.path,f=e.parts[0];if(this.options.knownHelpers[f])this.opcode("invokeKnownHelper",d.length,f);else{if(this.options.knownHelpersOnly)throw new k["default"]("You specified knownHelpersOnly, but used the unknown helper "+f,a);e.falsy=!0,this.accept(e),this.opcode("invokeHelper",d.length,e.original,n["default"].helpers.simpleId(e))}},PathExpression:function(a){this.addDepth(a.depth),this.opcode("getContext",a.depth);var b=a.parts[0],c=n["default"].helpers.scopedId(a),d=!a.depth&&!c&&this.blockParamIndex(b);d?this.opcode("lookupBlockParam",d,a.parts):b?a.data?(this.options.data=!0,this.opcode("lookupData",a.depth,a.parts)):this.opcode("lookupOnContext",a.parts,a.falsy,c):this.opcode("pushContext")},StringLiteral:function(a){this.opcode("pushString",a.value)},NumberLiteral:function(a){this.opcode("pushLiteral",a.value)},BooleanLiteral:function(a){this.opcode("pushLiteral",a.value)},UndefinedLiteral:function(){this.opcode("pushLiteral","undefined")},NullLiteral:function(){this.opcode("pushLiteral","null")},Hash:function(a){var b=a.pairs,c=0,d=b.length;for(this.opcode("pushHash");d>c;c++)this.pushParam(b[c].value);for(;c--;)this.opcode("assignToHash",b[c].key);this.opcode("popHash")},opcode:function(a){this.opcodes.push({opcode:a,args:o.call(arguments,1),loc:this.sourceNode[0].loc})},addDepth:function(a){a&&(this.useDepths=!0)},classifySexpr:function(a){var b=n["default"].helpers.simpleId(a.path),c=b&&!!this.blockParamIndex(a.path.parts[0]),d=!c&&n["default"].helpers.helperExpression(a),e=!c&&(d||b);if(e&&!d){var f=a.path.parts[0],g=this.options;g.knownHelpers[f]?d=!0:g.knownHelpersOnly&&(e=!1)}return d?"helper":e?"ambiguous":"simple"},pushParams:function(a){for(var b=0,c=a.length;c>b;b++)this.pushParam(a[b])},pushParam:function(a){var b=null!=a.value?a.value:a.original||"";if(this.stringParams)b.replace&&(b=b.replace(/^(\.?\.\/)*/g,"").replace(/\//g,".")),a.depth&&this.addDepth(a.depth),this.opcode("getContext",a.depth||0),this.opcode("pushStringParam",b,a.type),"SubExpression"===a.type&&this.accept(a);else{if(this.trackIds){var c=void 0;if(!a.parts||n["default"].helpers.scopedId(a)||a.depth||(c=this.blockParamIndex(a.parts[0])),c){var d=a.parts.slice(1).join(".");this.opcode("pushId","BlockParam",c,d)}else b=a.original||b,b.replace&&(b=b.replace(/^\.\//g,"").replace(/^\.$/g,"")),this.opcode("pushId",a.type,b)}this.accept(a)}},setupFullMustacheParams:function(a,b,c,d){var e=a.params;return this.pushParams(e),this.opcode("pushProgram",b),this.opcode("pushProgram",c),a.hash?this.accept(a.hash):this.opcode("emptyHash",d),e},blockParamIndex:function(a){for(var b=0,c=this.options.blockParams.length;c>b;b++){var d=this.options.blockParams[b],e=d&&l.indexOf(d,a);if(d&&e>=0)return[b,e]}}}},function(a,b,c){"use strict";function d(a){this.value=a}function e(){}function f(a,b,c,d){var e=b.popStack(),f=0,g=c.length;for(a&&g--;g>f;f++)e=b.nameLookup(e,c[f],d);return a?[b.aliasable("this.strict"),"(",e,", ",b.quotedString(c[f]),")"]:e}var g=c(8)["default"];b.__esModule=!0;var h=c(9),i=c(11),j=g(i),k=c(12),l=c(17),m=g(l);e.prototype={nameLookup:function(a,b){return e.isValidJavaScriptVariableName(b)?[a,".",b]:[a,"['",b,"']"]},depthedLookup:function(a){return[this.aliasable("this.lookup"),'(depths, "',a,'")']},compilerInfo:function(){var a=h.COMPILER_REVISION,b=h.REVISION_CHANGES[a];return[a,b]},appendToBuffer:function(a,b,c){return k.isArray(a)||(a=[a]),a=this.source.wrap(a,b),this.environment.isSimple?["return ",a,";"]:c?["buffer += ",a,";"]:(a.appendToBuffer=!0,a)},initializeBuffer:function(){return this.quotedString("")},compile:function(a,b,c,d){this.environment=a,this.options=b,this.stringParams=this.options.stringParams,this.trackIds=this.options.trackIds,this.precompile=!d,this.name=this.environment.name,this.isChild=!!c,this.context=c||{programs:[],environments:[]},this.preamble(),this.stackSlot=0,this.stackVars=[],this.aliases={},this.registers={list:[]},this.hashes=[],this.compileStack=[],this.inlineStack=[],this.blockParams=[],this.compileChildren(a,b),this.useDepths=this.useDepths||a.useDepths||this.options.compat,this.useBlockParams=this.useBlockParams||a.useBlockParams;var e=a.opcodes,f=void 0,g=void 0,h=void 0,i=void 0;for(h=0,i=e.length;i>h;h++)f=e[h],this.source.currentLocation=f.loc,g=g||f.loc,this[f.opcode].apply(this,f.args);if(this.source.currentLocation=g,this.pushSource(""),this.stackSlot||this.inlineStack.length||this.compileStack.length)throw new j["default"]("Compile completed with content left on stack");var k=this.createFunctionContext(d);if(this.isChild)return k;var l={compiler:this.compilerInfo(),main:k},m=this.context.programs;for(h=0,i=m.length;i>h;h++)m[h]&&(l[h]=m[h]);return this.environment.usePartial&&(l.usePartial=!0),this.options.data&&(l.useData=!0),this.useDepths&&(l.useDepths=!0),this.useBlockParams&&(l.useBlockParams=!0),this.options.compat&&(l.compat=!0),d?l.compilerOptions=this.options:(l.compiler=JSON.stringify(l.compiler),this.source.currentLocation={start:{line:1,column:0}},l=this.objectLiteral(l),b.srcName?(l=l.toStringWithSourceMap({file:b.destName}),l.map=l.map&&l.map.toString()):l=l.toString()),l},preamble:function(){this.lastContext=0,this.source=new m["default"](this.options.srcName)},createFunctionContext:function(a){var b="",c=this.stackVars.concat(this.registers.list);c.length>0&&(b+=", "+c.join(", "));var d=0;for(var e in this.aliases){var f=this.aliases[e];this.aliases.hasOwnProperty(e)&&f.children&&f.referenceCount>1&&(b+=", alias"+ ++d+"="+e,f.children[0]="alias"+d)}var g=["depth0","helpers","partials","data"];(this.useBlockParams||this.useDepths)&&g.push("blockParams"),this.useDepths&&g.push("depths");var h=this.mergeSource(b);return a?(g.push(h),Function.apply(this,g)):this.source.wrap(["function(",g.join(","),") {\n  ",h,"}"])},mergeSource:function(a){var b=this.environment.isSimple,c=!this.forceBuffer,d=void 0,e=void 0,f=void 0,g=void 0;return this.source.each(function(a){a.appendToBuffer?(f?a.prepend("  + "):f=a,g=a):(f&&(e?f.prepend("buffer += "):d=!0,g.add(";"),f=g=void 0),e=!0,b||(c=!1))}),c?f?(f.prepend("return "),g.add(";")):e||this.source.push('return "";'):(a+=", buffer = "+(d?"":this.initializeBuffer()),f?(f.prepend("return buffer + "),g.add(";")):this.source.push("return buffer;")),a&&this.source.prepend("var "+a.substring(2)+(d?"":";\n")),this.source.merge()},blockValue:function(a){var b=this.aliasable("helpers.blockHelperMissing"),c=[this.contextName(0)];this.setupHelperArgs(a,0,c);var d=this.popStack();c.splice(1,0,d),this.push(this.source.functionCall(b,"call",c))},ambiguousBlockValue:function(){var a=this.aliasable("helpers.blockHelperMissing"),b=[this.contextName(0)];this.setupHelperArgs("",0,b,!0),this.flushInline();var c=this.topStack();b.splice(1,0,c),this.pushSource(["if (!",this.lastHelper,") { ",c," = ",this.source.functionCall(a,"call",b),"}"])},appendContent:function(a){this.pendingContent?a=this.pendingContent+a:this.pendingLocation=this.source.currentLocation,this.pendingContent=a},append:function(){if(this.isInline())this.replaceStack(function(a){return[" != null ? ",a,' : ""']}),this.pushSource(this.appendToBuffer(this.popStack()));else{var a=this.popStack();this.pushSource(["if (",a," != null) { ",this.appendToBuffer(a,void 0,!0)," }"]),this.environment.isSimple&&this.pushSource(["else { ",this.appendToBuffer("''",void 0,!0)," }"])}},appendEscaped:function(){this.pushSource(this.appendToBuffer([this.aliasable("this.escapeExpression"),"(",this.popStack(),")"]))},getContext:function(a){this.lastContext=a},pushContext:function(){this.pushStackLiteral(this.contextName(this.lastContext))},lookupOnContext:function(a,b,c){var d=0;c||!this.options.compat||this.lastContext?this.pushContext():this.push(this.depthedLookup(a[d++])),this.resolvePath("context",a,d,b)},lookupBlockParam:function(a,b){this.useBlockParams=!0,this.push(["blockParams[",a[0],"][",a[1],"]"]),this.resolvePath("context",b,1)},lookupData:function(a,b){this.pushStackLiteral(a?"this.data(data, "+a+")":"data"),this.resolvePath("data",b,0,!0)},resolvePath:function(a,b,c,d){var e=this;if(this.options.strict||this.options.assumeObjects)return void this.push(f(this.options.strict,this,b,a));for(var g=b.length;g>c;c++)this.replaceStack(function(f){var g=e.nameLookup(f,b[c],a);return d?[" && ",g]:[" != null ? ",g," : ",f]})},resolvePossibleLambda:function(){this.push([this.aliasable("this.lambda"),"(",this.popStack(),", ",this.contextName(0),")"])},pushStringParam:function(a,b){this.pushContext(),this.pushString(b),"SubExpression"!==b&&("string"==typeof a?this.pushString(a):this.pushStackLiteral(a))},emptyHash:function(a){this.trackIds&&this.push("{}"),this.stringParams&&(this.push("{}"),this.push("{}")),this.pushStackLiteral(a?"undefined":"{}")},pushHash:function(){this.hash&&this.hashes.push(this.hash),this.hash={values:[],types:[],contexts:[],ids:[]}},popHash:function(){var a=this.hash;this.hash=this.hashes.pop(),this.trackIds&&this.push(this.objectLiteral(a.ids)),this.stringParams&&(this.push(this.objectLiteral(a.contexts)),this.push(this.objectLiteral(a.types))),this.push(this.objectLiteral(a.values))},pushString:function(a){this.pushStackLiteral(this.quotedString(a))},pushLiteral:function(a){this.pushStackLiteral(a)},pushProgram:function(a){this.pushStackLiteral(null!=a?this.programExpression(a):null)},invokeHelper:function(a,b,c){var d=this.popStack(),e=this.setupHelper(a,b),f=c?[e.name," || "]:"",g=["("].concat(f,d);this.options.strict||g.push(" || ",this.aliasable("helpers.helperMissing")),g.push(")"),this.push(this.source.functionCall(g,"call",e.callParams))},invokeKnownHelper:function(a,b){var c=this.setupHelper(a,b);this.push(this.source.functionCall(c.name,"call",c.callParams))},invokeAmbiguous:function(a,b){this.useRegister("helper");var c=this.popStack();this.emptyHash();var d=this.setupHelper(0,a,b),e=this.lastHelper=this.nameLookup("helpers",a,"helper"),f=["(","(helper = ",e," || ",c,")"];this.options.strict||(f[0]="(helper = ",f.push(" != null ? helper : ",this.aliasable("helpers.helperMissing"))),this.push(["(",f,d.paramsInit?["),(",d.paramsInit]:[],"),","(typeof helper === ",this.aliasable('"function"')," ? ",this.source.functionCall("helper","call",d.callParams)," : helper))"])},invokePartial:function(a,b,c){var d=[],e=this.setupParams(b,1,d,!1);a&&(b=this.popStack(),delete e.name),c&&(e.indent=JSON.stringify(c)),e.helpers="helpers",e.partials="partials",d.unshift(a?b:this.nameLookup("partials",b,"partial")),this.options.compat&&(e.depths="depths"),e=this.objectLiteral(e),d.push(e),this.push(this.source.functionCall("this.invokePartial","",d))},assignToHash:function(a){var b=this.popStack(),c=void 0,d=void 0,e=void 0;this.trackIds&&(e=this.popStack()),this.stringParams&&(d=this.popStack(),c=this.popStack());var f=this.hash;c&&(f.contexts[a]=c),d&&(f.types[a]=d),e&&(f.ids[a]=e),f.values[a]=b},pushId:function(a,b,c){"BlockParam"===a?this.pushStackLiteral("blockParams["+b[0]+"].path["+b[1]+"]"+(c?" + "+JSON.stringify("."+c):"")):"PathExpression"===a?this.pushString(b):this.pushStackLiteral("SubExpression"===a?"true":"null")},compiler:e,compileChildren:function(a,b){for(var c=a.children,d=void 0,e=void 0,f=0,g=c.length;g>f;f++){d=c[f],e=new this.compiler;var h=this.matchExistingProgram(d);null==h?(this.context.programs.push(""),h=this.context.programs.length,d.index=h,d.name="program"+h,this.context.programs[h]=e.compile(d,b,this.context,!this.precompile),this.context.environments[h]=d,this.useDepths=this.useDepths||e.useDepths,this.useBlockParams=this.useBlockParams||e.useBlockParams):(d.index=h,d.name="program"+h,this.useDepths=this.useDepths||d.useDepths,this.useBlockParams=this.useBlockParams||d.useBlockParams)}},matchExistingProgram:function(a){for(var b=0,c=this.context.environments.length;c>b;b++){var d=this.context.environments[b];if(d&&d.equals(a))return b}},programExpression:function(a){var b=this.environment.children[a],c=[b.index,"data",b.blockParams];return(this.useBlockParams||this.useDepths)&&c.push("blockParams"),this.useDepths&&c.push("depths"),"this.program("+c.join(", ")+")"},useRegister:function(a){this.registers[a]||(this.registers[a]=!0,this.registers.list.push(a))},push:function(a){return a instanceof d||(a=this.source.wrap(a)),this.inlineStack.push(a),a},pushStackLiteral:function(a){this.push(new d(a))},pushSource:function(a){this.pendingContent&&(this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation)),this.pendingContent=void 0),a&&this.source.push(a)},replaceStack:function(a){var b=["("],c=void 0,e=void 0,f=void 0;if(!this.isInline())throw new j["default"]("replaceStack on non-inline");var g=this.popStack(!0);if(g instanceof d)c=[g.value],b=["(",c],f=!0;else{e=!0;var h=this.incrStack();b=["((",this.push(h)," = ",g,")"],c=this.topStack()}var i=a.call(this,c);f||this.popStack(),e&&this.stackSlot--,this.push(b.concat(i,")"))},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push("stack"+this.stackSlot),this.topStackName()},topStackName:function(){return"stack"+this.stackSlot},flushInline:function(){var a=this.inlineStack;this.inlineStack=[];for(var b=0,c=a.length;c>b;b++){var e=a[b];if(e instanceof d)this.compileStack.push(e);else{var f=this.incrStack();this.pushSource([f," = ",e,";"]),this.compileStack.push(f)}}},isInline:function(){return this.inlineStack.length},popStack:function(a){var b=this.isInline(),c=(b?this.inlineStack:this.compileStack).pop();if(!a&&c instanceof d)return c.value;if(!b){if(!this.stackSlot)throw new j["default"]("Invalid stack pop");this.stackSlot--}return c},topStack:function(){var a=this.isInline()?this.inlineStack:this.compileStack,b=a[a.length-1];return b instanceof d?b.value:b},contextName:function(a){return this.useDepths&&a?"depths["+a+"]":"depth"+a},quotedString:function(a){return this.source.quotedString(a)},objectLiteral:function(a){return this.source.objectLiteral(a)},aliasable:function(a){var b=this.aliases[a];return b?(b.referenceCount++,b):(b=this.aliases[a]=this.source.wrap(a),b.aliasable=!0,b.referenceCount=1,b)},setupHelper:function(a,b,c){var d=[],e=this.setupHelperArgs(b,a,d,c),f=this.nameLookup("helpers",b,"helper");return{params:d,paramsInit:e,name:f,callParams:[this.contextName(0)].concat(d)}},setupParams:function(a,b,c){var d={},e=[],f=[],g=[],h=void 0;d.name=this.quotedString(a),d.hash=this.popStack(),this.trackIds&&(d.hashIds=this.popStack()),this.stringParams&&(d.hashTypes=this.popStack(),d.hashContexts=this.popStack());var i=this.popStack(),j=this.popStack();(j||i)&&(d.fn=j||"this.noop",d.inverse=i||"this.noop");for(var k=b;k--;)h=this.popStack(),c[k]=h,this.trackIds&&(g[k]=this.popStack()),this.stringParams&&(f[k]=this.popStack(),e[k]=this.popStack());return this.trackIds&&(d.ids=this.source.generateArray(g)),this.stringParams&&(d.types=this.source.generateArray(f),d.contexts=this.source.generateArray(e)),this.options.data&&(d.data="data"),this.useBlockParams&&(d.blockParams="blockParams"),d},setupHelperArgs:function(a,b,c,d){var e=this.setupParams(a,b,c,!0);return e=this.objectLiteral(e),d?(this.useRegister("options"),c.push("options"),["options=",e]):(c.push(e),"")}},function(){for(var a="break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(" "),b=e.RESERVED_WORDS={},c=0,d=a.length;d>c;c++)b[a[c]]=!0}(),e.isValidJavaScriptVariableName=function(a){return!e.RESERVED_WORDS[a]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(a)},b["default"]=e,a.exports=b["default"]},function(a,b,c){"use strict";function d(){this.parents=[]}var e=c(8)["default"];b.__esModule=!0;var f=c(11),g=e(f),h=c(2),i=e(h);d.prototype={constructor:d,mutating:!1,acceptKey:function(a,b){var c=this.accept(a[b]);if(this.mutating){if(c&&(!c.type||!i["default"][c.type]))throw new g["default"]('Unexpected node type "'+c.type+'" found when accepting '+b+" on "+a.type);a[b]=c}},acceptRequired:function(a,b){if(this.acceptKey(a,b),!a[b])throw new g["default"](a.type+" requires "+b)},acceptArray:function(a){for(var b=0,c=a.length;c>b;b++)this.acceptKey(a,b),a[b]||(a.splice(b,1),b--,c--)},accept:function(a){if(a){this.current&&this.parents.unshift(this.current),this.current=a;var b=this[a.type](a);return this.current=this.parents.shift(),!this.mutating||b?b:b!==!1?a:void 0}},Program:function(a){this.acceptArray(a.body)},MustacheStatement:function(a){this.acceptRequired(a,"path"),this.acceptArray(a.params),this.acceptKey(a,"hash")},BlockStatement:function(a){this.acceptRequired(a,"path"),this.acceptArray(a.params),this.acceptKey(a,"hash"),this.acceptKey(a,"program"),this.acceptKey(a,"inverse")},PartialStatement:function(a){this.acceptRequired(a,"name"),this.acceptArray(a.params),this.acceptKey(a,"hash")},ContentStatement:function(){},CommentStatement:function(){},SubExpression:function(a){this.acceptRequired(a,"path"),this.acceptArray(a.params),this.acceptKey(a,"hash")},PathExpression:function(){},StringLiteral:function(){},NumberLiteral:function(){},BooleanLiteral:function(){},UndefinedLiteral:function(){},NullLiteral:function(){},Hash:function(a){this.acceptArray(a.pairs)},HashPair:function(a){this.acceptRequired(a,"value")}},b["default"]=d,a.exports=b["default"]},function(a,b){(function(c){"use strict";b.__esModule=!0,b["default"]=function(a){var b="undefined"!=typeof c?c:window,d=b.Handlebars;a.noConflict=function(){b.Handlebars===a&&(b.Handlebars=d)}},a.exports=b["default"]}).call(b,function(){return this}())},function(a,b){"use strict";b["default"]=function(a){return a&&a.__esModule?a:{"default":a}},b.__esModule=!0},function(a,b,c){"use strict";function d(a,b){this.helpers=a||{},this.partials=b||{},e(this)}function e(a){a.registerHelper("helperMissing",function(){if(1===arguments.length)return void 0;throw new k["default"]('Missing helper: "'+arguments[arguments.length-1].name+'"')}),a.registerHelper("blockHelperMissing",function(b,c){var d=c.inverse,e=c.fn;if(b===!0)return e(this);if(b===!1||null==b)return d(this);if(o(b))return b.length>0?(c.ids&&(c.ids=[c.name]),a.helpers.each(b,c)):d(this);if(c.data&&c.ids){var g=f(c.data);g.contextPath=i.appendContextPath(c.data.contextPath,c.name),c={data:g}}return e(b,c)}),a.registerHelper("each",function(a,b){function c(b,c,e){j&&(j.key=b,j.index=c,j.first=0===c,j.last=!!e,l&&(j.contextPath=l+b)),h+=d(a[b],{data:j,blockParams:i.blockParams([a[b],b],[l+b,null])})}if(!b)throw new k["default"]("Must pass iterator to #each");var d=b.fn,e=b.inverse,g=0,h="",j=void 0,l=void 0;if(b.data&&b.ids&&(l=i.appendContextPath(b.data.contextPath,b.ids[0])+"."),p(a)&&(a=a.call(this)),b.data&&(j=f(b.data)),a&&"object"==typeof a)if(o(a))for(var m=a.length;m>g;g++)c(g,g,g===a.length-1);else{var n=void 0;for(var q in a)a.hasOwnProperty(q)&&(n&&c(n,g-1),n=q,g++);n&&c(n,g-1,!0)}return 0===g&&(h=e(this)),h}),a.registerHelper("if",function(a,b){return p(a)&&(a=a.call(this)),!b.hash.includeZero&&!a||i.isEmpty(a)?b.inverse(this):b.fn(this)}),a.registerHelper("unless",function(b,c){return a.helpers["if"].call(this,b,{fn:c.inverse,inverse:c.fn,hash:c.hash})}),a.registerHelper("with",function(a,b){p(a)&&(a=a.call(this));var c=b.fn;if(i.isEmpty(a))return b.inverse(this);if(b.data&&b.ids){var d=f(b.data);d.contextPath=i.appendContextPath(b.data.contextPath,b.ids[0]),b={data:d}}return c(a,b)}),a.registerHelper("log",function(b,c){var d=c.data&&null!=c.data.level?parseInt(c.data.level,10):1;a.log(d,b)}),a.registerHelper("lookup",function(a,b){return a&&a[b]})}function f(a){var b=i.extend({},a);return b._parent=a,b}var g=c(8)["default"];b.__esModule=!0,b.HandlebarsEnvironment=d,b.createFrame=f;var h=c(12),i=g(h),j=c(11),k=g(j),l="3.0.1";b.VERSION=l;var m=6;b.COMPILER_REVISION=m;var n={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:"== 1.x.x",5:"== 2.0.0-alpha.x",6:">= 2.0.0-beta.1"};b.REVISION_CHANGES=n;var o=i.isArray,p=i.isFunction,q=i.toString,r="[object Object]";d.prototype={constructor:d,logger:s,log:t,registerHelper:function(a,b){if(q.call(a)===r){if(b)throw new k["default"]("Arg not supported with multiple helpers");i.extend(this.helpers,a)}else this.helpers[a]=b},unregisterHelper:function(a){delete this.helpers[a]},registerPartial:function(a,b){if(q.call(a)===r)i.extend(this.partials,a);else{if("undefined"==typeof b)throw new k["default"]("Attempting to register a partial as undefined");this.partials[a]=b}},unregisterPartial:function(a){delete this.partials[a]}};var s={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:1,log:function(a,b){if("undefined"!=typeof console&&s.level<=a){var c=s.methodMap[a];(console[c]||console.log).call(console,b)}}};b.logger=s;var t=s.log;b.log=t},function(a,b){"use strict";function c(a){this.string=a}b.__esModule=!0,c.prototype.toString=c.prototype.toHTML=function(){return""+this.string},b["default"]=c,a.exports=b["default"]},function(a,b){"use strict";function c(a,b){var e=b&&b.loc,f=void 0,g=void 0;e&&(f=e.start.line,g=e.start.column,a+=" - "+f+":"+g);for(var h=Error.prototype.constructor.call(this,a),i=0;i<d.length;i++)this[d[i]]=h[d[i]];Error.captureStackTrace&&Error.captureStackTrace(this,c),e&&(this.lineNumber=f,this.column=g)}b.__esModule=!0;var d=["description","fileName","lineNumber","message","name","number","stack"];c.prototype=new Error,b["default"]=c,a.exports=b["default"]},function(a,b){"use strict";function c(a){return j[a]}function d(a){for(var b=1;b<arguments.length;b++)for(var c in arguments[b])Object.prototype.hasOwnProperty.call(arguments[b],c)&&(a[c]=arguments[b][c]);return a}function e(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1}function f(a){if("string"!=typeof a){if(a&&a.toHTML)return a.toHTML();if(null==a)return"";if(!a)return a+"";a=""+a}return l.test(a)?a.replace(k,c):a}function g(a){return a||0===a?o(a)&&0===a.length?!0:!1:!0}function h(a,b){return a.path=b,a}function i(a,b){return(a?a+".":"")+b}b.__esModule=!0,b.extend=d,b.indexOf=e,b.escapeExpression=f,b.isEmpty=g,b.blockParams=h,b.appendContextPath=i;var j={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},k=/[&<>"'`]/g,l=/[&<>"'`]/,m=Object.prototype.toString;b.toString=m;var n=function(a){return"function"==typeof a};n(/x/)&&(b.isFunction=n=function(a){return"function"==typeof a&&"[object Function]"===m.call(a)});var n;b.isFunction=n;var o=Array.isArray||function(a){return a&&"object"==typeof a?"[object Array]"===m.call(a):!1};b.isArray=o},function(a,b,c){"use strict";function d(a){var b=a&&a[0]||1,c=p.COMPILER_REVISION;if(b!==c){if(c>b){var d=p.REVISION_CHANGES[c],e=p.REVISION_CHANGES[b];throw new o["default"]("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+d+") or downgrade your runtime to an older version ("+e+").")}throw new o["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+a[1]+").")}}function e(a,b){function c(c,d,e){e.hash&&(d=m.extend({},d,e.hash)),c=b.VM.resolvePartial.call(this,c,d,e);var f=b.VM.invokePartial.call(this,c,d,e);if(null==f&&b.compile&&(e.partials[e.name]=b.compile(c,a.compilerOptions,b),f=e.partials[e.name](d,e)),null!=f){if(e.indent){for(var g=f.split("\n"),h=0,i=g.length;i>h&&(g[h]||h+1!==i);h++)g[h]=e.indent+g[h];f=g.join("\n")}return f}throw new o["default"]("The partial "+e.name+" could not be compiled when running in runtime-only mode")}function d(b){var c=void 0===arguments[1]?{}:arguments[1],f=c.data;
d._setup(c),!c.partial&&a.useData&&(f=j(b,f));var g=void 0,h=a.useBlockParams?[]:void 0;return a.useDepths&&(g=c.depths?[b].concat(c.depths):[b]),a.main.call(e,b,e.helpers,e.partials,f,h,g)}if(!b)throw new o["default"]("No environment passed to template");if(!a||!a.main)throw new o["default"]("Unknown template object: "+typeof a);b.VM.checkRevision(a.compiler);var e={strict:function(a,b){if(!(b in a))throw new o["default"]('"'+b+'" not defined in '+a);return a[b]},lookup:function(a,b){for(var c=a.length,d=0;c>d;d++)if(a[d]&&null!=a[d][b])return a[d][b]},lambda:function(a,b){return"function"==typeof a?a.call(b):a},escapeExpression:m.escapeExpression,invokePartial:c,fn:function(b){return a[b]},programs:[],program:function(a,b,c,d,e){var g=this.programs[a],h=this.fn(a);return b||e||d||c?g=f(this,a,h,b,c,d,e):g||(g=this.programs[a]=f(this,a,h)),g},data:function(a,b){for(;a&&b--;)a=a._parent;return a},merge:function(a,b){var c=a||b;return a&&b&&a!==b&&(c=m.extend({},b,a)),c},noop:b.VM.noop,compilerInfo:a.compiler};return d.isTop=!0,d._setup=function(c){c.partial?(e.helpers=c.helpers,e.partials=c.partials):(e.helpers=e.merge(c.helpers,b.helpers),a.usePartial&&(e.partials=e.merge(c.partials,b.partials)))},d._child=function(b,c,d,g){if(a.useBlockParams&&!d)throw new o["default"]("must pass block params");if(a.useDepths&&!g)throw new o["default"]("must pass parent depths");return f(e,b,a[b],c,0,d,g)},d}function f(a,b,c,d,e,f,g){function h(b){var e=void 0===arguments[1]?{}:arguments[1];return c.call(a,b,a.helpers,a.partials,e.data||d,f&&[e.blockParams].concat(f),g&&[b].concat(g))}return h.program=b,h.depth=g?g.length:0,h.blockParams=e||0,h}function g(a,b,c){return a?a.call||c.name||(c.name=a,a=c.partials[a]):a=c.partials[c.name],a}function h(a,b,c){if(c.partial=!0,void 0===a)throw new o["default"]("The partial "+c.name+" could not be found");return a instanceof Function?a(b,c):void 0}function i(){return""}function j(a,b){return b&&"root"in b||(b=b?p.createFrame(b):{},b.root=a),b}var k=c(8)["default"];b.__esModule=!0,b.checkRevision=d,b.template=e,b.wrapProgram=f,b.resolvePartial=g,b.invokePartial=h,b.noop=i;var l=c(12),m=k(l),n=c(11),o=k(n),p=c(9)},function(a,b){"use strict";b.__esModule=!0;var c=function(){function a(){this.yy={}}var b={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,program_repetition0:6,statement:7,mustache:8,block:9,rawBlock:10,partial:11,content:12,COMMENT:13,CONTENT:14,openRawBlock:15,END_RAW_BLOCK:16,OPEN_RAW_BLOCK:17,helperName:18,openRawBlock_repetition0:19,openRawBlock_option0:20,CLOSE_RAW_BLOCK:21,openBlock:22,block_option0:23,closeBlock:24,openInverse:25,block_option1:26,OPEN_BLOCK:27,openBlock_repetition0:28,openBlock_option0:29,openBlock_option1:30,CLOSE:31,OPEN_INVERSE:32,openInverse_repetition0:33,openInverse_option0:34,openInverse_option1:35,openInverseChain:36,OPEN_INVERSE_CHAIN:37,openInverseChain_repetition0:38,openInverseChain_option0:39,openInverseChain_option1:40,inverseAndProgram:41,INVERSE:42,inverseChain:43,inverseChain_option0:44,OPEN_ENDBLOCK:45,OPEN:46,mustache_repetition0:47,mustache_option0:48,OPEN_UNESCAPED:49,mustache_repetition1:50,mustache_option1:51,CLOSE_UNESCAPED:52,OPEN_PARTIAL:53,partialName:54,partial_repetition0:55,partial_option0:56,param:57,sexpr:58,OPEN_SEXPR:59,sexpr_repetition0:60,sexpr_option0:61,CLOSE_SEXPR:62,hash:63,hash_repetition_plus0:64,hashSegment:65,ID:66,EQUALS:67,blockParams:68,OPEN_BLOCK_PARAMS:69,blockParams_repetition_plus0:70,CLOSE_BLOCK_PARAMS:71,path:72,dataName:73,STRING:74,NUMBER:75,BOOLEAN:76,UNDEFINED:77,NULL:78,DATA:79,pathSegments:80,SEP:81,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",13:"COMMENT",14:"CONTENT",16:"END_RAW_BLOCK",17:"OPEN_RAW_BLOCK",21:"CLOSE_RAW_BLOCK",27:"OPEN_BLOCK",31:"CLOSE",32:"OPEN_INVERSE",37:"OPEN_INVERSE_CHAIN",42:"INVERSE",45:"OPEN_ENDBLOCK",46:"OPEN",49:"OPEN_UNESCAPED",52:"CLOSE_UNESCAPED",53:"OPEN_PARTIAL",59:"OPEN_SEXPR",62:"CLOSE_SEXPR",66:"ID",67:"EQUALS",69:"OPEN_BLOCK_PARAMS",71:"CLOSE_BLOCK_PARAMS",74:"STRING",75:"NUMBER",76:"BOOLEAN",77:"UNDEFINED",78:"NULL",79:"DATA",81:"SEP"},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[12,1],[10,3],[15,5],[9,4],[9,4],[22,6],[25,6],[36,6],[41,2],[43,3],[43,1],[24,3],[8,5],[8,5],[11,5],[57,1],[57,1],[58,5],[63,1],[65,3],[68,3],[18,1],[18,1],[18,1],[18,1],[18,1],[18,1],[18,1],[54,1],[54,1],[73,2],[72,1],[80,3],[80,1],[6,0],[6,2],[19,0],[19,2],[20,0],[20,1],[23,0],[23,1],[26,0],[26,1],[28,0],[28,2],[29,0],[29,1],[30,0],[30,1],[33,0],[33,2],[34,0],[34,1],[35,0],[35,1],[38,0],[38,2],[39,0],[39,1],[40,0],[40,1],[44,0],[44,1],[47,0],[47,2],[48,0],[48,1],[50,0],[50,2],[51,0],[51,1],[55,0],[55,2],[56,0],[56,1],[60,0],[60,2],[61,0],[61,1],[64,1],[64,2],[70,1],[70,2]],performAction:function(a,b,c,d,e,f){var g=f.length-1;switch(e){case 1:return f[g-1];case 2:this.$=new d.Program(f[g],null,{},d.locInfo(this._$));break;case 3:this.$=f[g];break;case 4:this.$=f[g];break;case 5:this.$=f[g];break;case 6:this.$=f[g];break;case 7:this.$=f[g];break;case 8:this.$=new d.CommentStatement(d.stripComment(f[g]),d.stripFlags(f[g],f[g]),d.locInfo(this._$));break;case 9:this.$=new d.ContentStatement(f[g],d.locInfo(this._$));break;case 10:this.$=d.prepareRawBlock(f[g-2],f[g-1],f[g],this._$);break;case 11:this.$={path:f[g-3],params:f[g-2],hash:f[g-1]};break;case 12:this.$=d.prepareBlock(f[g-3],f[g-2],f[g-1],f[g],!1,this._$);break;case 13:this.$=d.prepareBlock(f[g-3],f[g-2],f[g-1],f[g],!0,this._$);break;case 14:this.$={path:f[g-4],params:f[g-3],hash:f[g-2],blockParams:f[g-1],strip:d.stripFlags(f[g-5],f[g])};break;case 15:this.$={path:f[g-4],params:f[g-3],hash:f[g-2],blockParams:f[g-1],strip:d.stripFlags(f[g-5],f[g])};break;case 16:this.$={path:f[g-4],params:f[g-3],hash:f[g-2],blockParams:f[g-1],strip:d.stripFlags(f[g-5],f[g])};break;case 17:this.$={strip:d.stripFlags(f[g-1],f[g-1]),program:f[g]};break;case 18:var h=d.prepareBlock(f[g-2],f[g-1],f[g],f[g],!1,this._$),i=new d.Program([h],null,{},d.locInfo(this._$));i.chained=!0,this.$={strip:f[g-2].strip,program:i,chain:!0};break;case 19:this.$=f[g];break;case 20:this.$={path:f[g-1],strip:d.stripFlags(f[g-2],f[g])};break;case 21:this.$=d.prepareMustache(f[g-3],f[g-2],f[g-1],f[g-4],d.stripFlags(f[g-4],f[g]),this._$);break;case 22:this.$=d.prepareMustache(f[g-3],f[g-2],f[g-1],f[g-4],d.stripFlags(f[g-4],f[g]),this._$);break;case 23:this.$=new d.PartialStatement(f[g-3],f[g-2],f[g-1],d.stripFlags(f[g-4],f[g]),d.locInfo(this._$));break;case 24:this.$=f[g];break;case 25:this.$=f[g];break;case 26:this.$=new d.SubExpression(f[g-3],f[g-2],f[g-1],d.locInfo(this._$));break;case 27:this.$=new d.Hash(f[g],d.locInfo(this._$));break;case 28:this.$=new d.HashPair(d.id(f[g-2]),f[g],d.locInfo(this._$));break;case 29:this.$=d.id(f[g-1]);break;case 30:this.$=f[g];break;case 31:this.$=f[g];break;case 32:this.$=new d.StringLiteral(f[g],d.locInfo(this._$));break;case 33:this.$=new d.NumberLiteral(f[g],d.locInfo(this._$));break;case 34:this.$=new d.BooleanLiteral(f[g],d.locInfo(this._$));break;case 35:this.$=new d.UndefinedLiteral(d.locInfo(this._$));break;case 36:this.$=new d.NullLiteral(d.locInfo(this._$));break;case 37:this.$=f[g];break;case 38:this.$=f[g];break;case 39:this.$=d.preparePath(!0,f[g],this._$);break;case 40:this.$=d.preparePath(!1,f[g],this._$);break;case 41:f[g-2].push({part:d.id(f[g]),original:f[g],separator:f[g-1]}),this.$=f[g-2];break;case 42:this.$=[{part:d.id(f[g]),original:f[g]}];break;case 43:this.$=[];break;case 44:f[g-1].push(f[g]);break;case 45:this.$=[];break;case 46:f[g-1].push(f[g]);break;case 53:this.$=[];break;case 54:f[g-1].push(f[g]);break;case 59:this.$=[];break;case 60:f[g-1].push(f[g]);break;case 65:this.$=[];break;case 66:f[g-1].push(f[g]);break;case 73:this.$=[];break;case 74:f[g-1].push(f[g]);break;case 77:this.$=[];break;case 78:f[g-1].push(f[g]);break;case 81:this.$=[];break;case 82:f[g-1].push(f[g]);break;case 85:this.$=[];break;case 86:f[g-1].push(f[g]);break;case 89:this.$=[f[g]];break;case 90:f[g-1].push(f[g]);break;case 91:this.$=[f[g]];break;case 92:f[g-1].push(f[g])}},table:[{3:1,4:2,5:[2,43],6:3,13:[2,43],14:[2,43],17:[2,43],27:[2,43],32:[2,43],46:[2,43],49:[2,43],53:[2,43]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:[1,11],14:[1,18],15:16,17:[1,21],22:14,25:15,27:[1,19],32:[1,20],37:[2,2],42:[2,2],45:[2,2],46:[1,12],49:[1,13],53:[1,17]},{1:[2,1]},{5:[2,44],13:[2,44],14:[2,44],17:[2,44],27:[2,44],32:[2,44],37:[2,44],42:[2,44],45:[2,44],46:[2,44],49:[2,44],53:[2,44]},{5:[2,3],13:[2,3],14:[2,3],17:[2,3],27:[2,3],32:[2,3],37:[2,3],42:[2,3],45:[2,3],46:[2,3],49:[2,3],53:[2,3]},{5:[2,4],13:[2,4],14:[2,4],17:[2,4],27:[2,4],32:[2,4],37:[2,4],42:[2,4],45:[2,4],46:[2,4],49:[2,4],53:[2,4]},{5:[2,5],13:[2,5],14:[2,5],17:[2,5],27:[2,5],32:[2,5],37:[2,5],42:[2,5],45:[2,5],46:[2,5],49:[2,5],53:[2,5]},{5:[2,6],13:[2,6],14:[2,6],17:[2,6],27:[2,6],32:[2,6],37:[2,6],42:[2,6],45:[2,6],46:[2,6],49:[2,6],53:[2,6]},{5:[2,7],13:[2,7],14:[2,7],17:[2,7],27:[2,7],32:[2,7],37:[2,7],42:[2,7],45:[2,7],46:[2,7],49:[2,7],53:[2,7]},{5:[2,8],13:[2,8],14:[2,8],17:[2,8],27:[2,8],32:[2,8],37:[2,8],42:[2,8],45:[2,8],46:[2,8],49:[2,8],53:[2,8]},{18:22,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{18:33,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{4:34,6:3,13:[2,43],14:[2,43],17:[2,43],27:[2,43],32:[2,43],37:[2,43],42:[2,43],45:[2,43],46:[2,43],49:[2,43],53:[2,43]},{4:35,6:3,13:[2,43],14:[2,43],17:[2,43],27:[2,43],32:[2,43],42:[2,43],45:[2,43],46:[2,43],49:[2,43],53:[2,43]},{12:36,14:[1,18]},{18:38,54:37,58:39,59:[1,40],66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{5:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],27:[2,9],32:[2,9],37:[2,9],42:[2,9],45:[2,9],46:[2,9],49:[2,9],53:[2,9]},{18:41,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{18:42,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{18:43,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{31:[2,73],47:44,59:[2,73],66:[2,73],74:[2,73],75:[2,73],76:[2,73],77:[2,73],78:[2,73],79:[2,73]},{21:[2,30],31:[2,30],52:[2,30],59:[2,30],62:[2,30],66:[2,30],69:[2,30],74:[2,30],75:[2,30],76:[2,30],77:[2,30],78:[2,30],79:[2,30]},{21:[2,31],31:[2,31],52:[2,31],59:[2,31],62:[2,31],66:[2,31],69:[2,31],74:[2,31],75:[2,31],76:[2,31],77:[2,31],78:[2,31],79:[2,31]},{21:[2,32],31:[2,32],52:[2,32],59:[2,32],62:[2,32],66:[2,32],69:[2,32],74:[2,32],75:[2,32],76:[2,32],77:[2,32],78:[2,32],79:[2,32]},{21:[2,33],31:[2,33],52:[2,33],59:[2,33],62:[2,33],66:[2,33],69:[2,33],74:[2,33],75:[2,33],76:[2,33],77:[2,33],78:[2,33],79:[2,33]},{21:[2,34],31:[2,34],52:[2,34],59:[2,34],62:[2,34],66:[2,34],69:[2,34],74:[2,34],75:[2,34],76:[2,34],77:[2,34],78:[2,34],79:[2,34]},{21:[2,35],31:[2,35],52:[2,35],59:[2,35],62:[2,35],66:[2,35],69:[2,35],74:[2,35],75:[2,35],76:[2,35],77:[2,35],78:[2,35],79:[2,35]},{21:[2,36],31:[2,36],52:[2,36],59:[2,36],62:[2,36],66:[2,36],69:[2,36],74:[2,36],75:[2,36],76:[2,36],77:[2,36],78:[2,36],79:[2,36]},{21:[2,40],31:[2,40],52:[2,40],59:[2,40],62:[2,40],66:[2,40],69:[2,40],74:[2,40],75:[2,40],76:[2,40],77:[2,40],78:[2,40],79:[2,40],81:[1,45]},{66:[1,32],80:46},{21:[2,42],31:[2,42],52:[2,42],59:[2,42],62:[2,42],66:[2,42],69:[2,42],74:[2,42],75:[2,42],76:[2,42],77:[2,42],78:[2,42],79:[2,42],81:[2,42]},{50:47,52:[2,77],59:[2,77],66:[2,77],74:[2,77],75:[2,77],76:[2,77],77:[2,77],78:[2,77],79:[2,77]},{23:48,36:50,37:[1,52],41:51,42:[1,53],43:49,45:[2,49]},{26:54,41:55,42:[1,53],45:[2,51]},{16:[1,56]},{31:[2,81],55:57,59:[2,81],66:[2,81],74:[2,81],75:[2,81],76:[2,81],77:[2,81],78:[2,81],79:[2,81]},{31:[2,37],59:[2,37],66:[2,37],74:[2,37],75:[2,37],76:[2,37],77:[2,37],78:[2,37],79:[2,37]},{31:[2,38],59:[2,38],66:[2,38],74:[2,38],75:[2,38],76:[2,38],77:[2,38],78:[2,38],79:[2,38]},{18:58,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{28:59,31:[2,53],59:[2,53],66:[2,53],69:[2,53],74:[2,53],75:[2,53],76:[2,53],77:[2,53],78:[2,53],79:[2,53]},{31:[2,59],33:60,59:[2,59],66:[2,59],69:[2,59],74:[2,59],75:[2,59],76:[2,59],77:[2,59],78:[2,59],79:[2,59]},{19:61,21:[2,45],59:[2,45],66:[2,45],74:[2,45],75:[2,45],76:[2,45],77:[2,45],78:[2,45],79:[2,45]},{18:65,31:[2,75],48:62,57:63,58:66,59:[1,40],63:64,64:67,65:68,66:[1,69],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{66:[1,70]},{21:[2,39],31:[2,39],52:[2,39],59:[2,39],62:[2,39],66:[2,39],69:[2,39],74:[2,39],75:[2,39],76:[2,39],77:[2,39],78:[2,39],79:[2,39],81:[1,45]},{18:65,51:71,52:[2,79],57:72,58:66,59:[1,40],63:73,64:67,65:68,66:[1,69],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{24:74,45:[1,75]},{45:[2,50]},{4:76,6:3,13:[2,43],14:[2,43],17:[2,43],27:[2,43],32:[2,43],37:[2,43],42:[2,43],45:[2,43],46:[2,43],49:[2,43],53:[2,43]},{45:[2,19]},{18:77,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{4:78,6:3,13:[2,43],14:[2,43],17:[2,43],27:[2,43],32:[2,43],45:[2,43],46:[2,43],49:[2,43],53:[2,43]},{24:79,45:[1,75]},{45:[2,52]},{5:[2,10],13:[2,10],14:[2,10],17:[2,10],27:[2,10],32:[2,10],37:[2,10],42:[2,10],45:[2,10],46:[2,10],49:[2,10],53:[2,10]},{18:65,31:[2,83],56:80,57:81,58:66,59:[1,40],63:82,64:67,65:68,66:[1,69],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{59:[2,85],60:83,62:[2,85],66:[2,85],74:[2,85],75:[2,85],76:[2,85],77:[2,85],78:[2,85],79:[2,85]},{18:65,29:84,31:[2,55],57:85,58:66,59:[1,40],63:86,64:67,65:68,66:[1,69],69:[2,55],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{18:65,31:[2,61],34:87,57:88,58:66,59:[1,40],63:89,64:67,65:68,66:[1,69],69:[2,61],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{18:65,20:90,21:[2,47],57:91,58:66,59:[1,40],63:92,64:67,65:68,66:[1,69],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{31:[1,93]},{31:[2,74],59:[2,74],66:[2,74],74:[2,74],75:[2,74],76:[2,74],77:[2,74],78:[2,74],79:[2,74]},{31:[2,76]},{21:[2,24],31:[2,24],52:[2,24],59:[2,24],62:[2,24],66:[2,24],69:[2,24],74:[2,24],75:[2,24],76:[2,24],77:[2,24],78:[2,24],79:[2,24]},{21:[2,25],31:[2,25],52:[2,25],59:[2,25],62:[2,25],66:[2,25],69:[2,25],74:[2,25],75:[2,25],76:[2,25],77:[2,25],78:[2,25],79:[2,25]},{21:[2,27],31:[2,27],52:[2,27],62:[2,27],65:94,66:[1,95],69:[2,27]},{21:[2,89],31:[2,89],52:[2,89],62:[2,89],66:[2,89],69:[2,89]},{21:[2,42],31:[2,42],52:[2,42],59:[2,42],62:[2,42],66:[2,42],67:[1,96],69:[2,42],74:[2,42],75:[2,42],76:[2,42],77:[2,42],78:[2,42],79:[2,42],81:[2,42]},{21:[2,41],31:[2,41],52:[2,41],59:[2,41],62:[2,41],66:[2,41],69:[2,41],74:[2,41],75:[2,41],76:[2,41],77:[2,41],78:[2,41],79:[2,41],81:[2,41]},{52:[1,97]},{52:[2,78],59:[2,78],66:[2,78],74:[2,78],75:[2,78],76:[2,78],77:[2,78],78:[2,78],79:[2,78]},{52:[2,80]},{5:[2,12],13:[2,12],14:[2,12],17:[2,12],27:[2,12],32:[2,12],37:[2,12],42:[2,12],45:[2,12],46:[2,12],49:[2,12],53:[2,12]},{18:98,66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{36:50,37:[1,52],41:51,42:[1,53],43:100,44:99,45:[2,71]},{31:[2,65],38:101,59:[2,65],66:[2,65],69:[2,65],74:[2,65],75:[2,65],76:[2,65],77:[2,65],78:[2,65],79:[2,65]},{45:[2,17]},{5:[2,13],13:[2,13],14:[2,13],17:[2,13],27:[2,13],32:[2,13],37:[2,13],42:[2,13],45:[2,13],46:[2,13],49:[2,13],53:[2,13]},{31:[1,102]},{31:[2,82],59:[2,82],66:[2,82],74:[2,82],75:[2,82],76:[2,82],77:[2,82],78:[2,82],79:[2,82]},{31:[2,84]},{18:65,57:104,58:66,59:[1,40],61:103,62:[2,87],63:105,64:67,65:68,66:[1,69],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{30:106,31:[2,57],68:107,69:[1,108]},{31:[2,54],59:[2,54],66:[2,54],69:[2,54],74:[2,54],75:[2,54],76:[2,54],77:[2,54],78:[2,54],79:[2,54]},{31:[2,56],69:[2,56]},{31:[2,63],35:109,68:110,69:[1,108]},{31:[2,60],59:[2,60],66:[2,60],69:[2,60],74:[2,60],75:[2,60],76:[2,60],77:[2,60],78:[2,60],79:[2,60]},{31:[2,62],69:[2,62]},{21:[1,111]},{21:[2,46],59:[2,46],66:[2,46],74:[2,46],75:[2,46],76:[2,46],77:[2,46],78:[2,46],79:[2,46]},{21:[2,48]},{5:[2,21],13:[2,21],14:[2,21],17:[2,21],27:[2,21],32:[2,21],37:[2,21],42:[2,21],45:[2,21],46:[2,21],49:[2,21],53:[2,21]},{21:[2,90],31:[2,90],52:[2,90],62:[2,90],66:[2,90],69:[2,90]},{67:[1,96]},{18:65,57:112,58:66,59:[1,40],66:[1,32],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{5:[2,22],13:[2,22],14:[2,22],17:[2,22],27:[2,22],32:[2,22],37:[2,22],42:[2,22],45:[2,22],46:[2,22],49:[2,22],53:[2,22]},{31:[1,113]},{45:[2,18]},{45:[2,72]},{18:65,31:[2,67],39:114,57:115,58:66,59:[1,40],63:116,64:67,65:68,66:[1,69],69:[2,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,28],78:[1,29],79:[1,31],80:30},{5:[2,23],13:[2,23],14:[2,23],17:[2,23],27:[2,23],32:[2,23],37:[2,23],42:[2,23],45:[2,23],46:[2,23],49:[2,23],53:[2,23]},{62:[1,117]},{59:[2,86],62:[2,86],66:[2,86],74:[2,86],75:[2,86],76:[2,86],77:[2,86],78:[2,86],79:[2,86]},{62:[2,88]},{31:[1,118]},{31:[2,58]},{66:[1,120],70:119},{31:[1,121]},{31:[2,64]},{14:[2,11]},{21:[2,28],31:[2,28],52:[2,28],62:[2,28],66:[2,28],69:[2,28]},{5:[2,20],13:[2,20],14:[2,20],17:[2,20],27:[2,20],32:[2,20],37:[2,20],42:[2,20],45:[2,20],46:[2,20],49:[2,20],53:[2,20]},{31:[2,69],40:122,68:123,69:[1,108]},{31:[2,66],59:[2,66],66:[2,66],69:[2,66],74:[2,66],75:[2,66],76:[2,66],77:[2,66],78:[2,66],79:[2,66]},{31:[2,68],69:[2,68]},{21:[2,26],31:[2,26],52:[2,26],59:[2,26],62:[2,26],66:[2,26],69:[2,26],74:[2,26],75:[2,26],76:[2,26],77:[2,26],78:[2,26],79:[2,26]},{13:[2,14],14:[2,14],17:[2,14],27:[2,14],32:[2,14],37:[2,14],42:[2,14],45:[2,14],46:[2,14],49:[2,14],53:[2,14]},{66:[1,125],71:[1,124]},{66:[2,91],71:[2,91]},{13:[2,15],14:[2,15],17:[2,15],27:[2,15],32:[2,15],42:[2,15],45:[2,15],46:[2,15],49:[2,15],53:[2,15]},{31:[1,126]},{31:[2,70]},{31:[2,29]},{66:[2,92],71:[2,92]},{13:[2,16],14:[2,16],17:[2,16],27:[2,16],32:[2,16],37:[2,16],42:[2,16],45:[2,16],46:[2,16],49:[2,16],53:[2,16]}],defaultActions:{4:[2,1],49:[2,50],51:[2,19],55:[2,52],64:[2,76],73:[2,80],78:[2,17],82:[2,84],92:[2,48],99:[2,18],100:[2,72],105:[2,88],107:[2,58],110:[2,64],111:[2,11],123:[2,70],124:[2,29]},parseError:function(a){throw new Error(a)},parse:function(a){function b(){var a;return a=c.lexer.lex()||1,"number"!=typeof a&&(a=c.symbols_[a]||a),a}var c=this,d=[0],e=[null],f=[],g=this.table,h="",i=0,j=0,k=0;this.lexer.setInput(a),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,"undefined"==typeof this.lexer.yylloc&&(this.lexer.yylloc={});var l=this.lexer.yylloc;f.push(l);var m=this.lexer.options&&this.lexer.options.ranges;"function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError);for(var n,o,p,q,r,s,t,u,v,w={};;){if(p=d[d.length-1],this.defaultActions[p]?q=this.defaultActions[p]:((null===n||"undefined"==typeof n)&&(n=b()),q=g[p]&&g[p][n]),"undefined"==typeof q||!q.length||!q[0]){var x="";if(!k){v=[];for(s in g[p])this.terminals_[s]&&s>2&&v.push("'"+this.terminals_[s]+"'");x=this.lexer.showPosition?"Parse error on line "+(i+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+v.join(", ")+", got '"+(this.terminals_[n]||n)+"'":"Parse error on line "+(i+1)+": Unexpected "+(1==n?"end of input":"'"+(this.terminals_[n]||n)+"'"),this.parseError(x,{text:this.lexer.match,token:this.terminals_[n]||n,line:this.lexer.yylineno,loc:l,expected:v})}}if(q[0]instanceof Array&&q.length>1)throw new Error("Parse Error: multiple actions possible at state: "+p+", token: "+n);switch(q[0]){case 1:d.push(n),e.push(this.lexer.yytext),f.push(this.lexer.yylloc),d.push(q[1]),n=null,o?(n=o,o=null):(j=this.lexer.yyleng,h=this.lexer.yytext,i=this.lexer.yylineno,l=this.lexer.yylloc,k>0&&k--);break;case 2:if(t=this.productions_[q[1]][1],w.$=e[e.length-t],w._$={first_line:f[f.length-(t||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(t||1)].first_column,last_column:f[f.length-1].last_column},m&&(w._$.range=[f[f.length-(t||1)].range[0],f[f.length-1].range[1]]),r=this.performAction.call(w,h,j,i,this.yy,q[1],e,f),"undefined"!=typeof r)return r;t&&(d=d.slice(0,-1*t*2),e=e.slice(0,-1*t),f=f.slice(0,-1*t)),d.push(this.productions_[q[1]][0]),e.push(w.$),f.push(w._$),u=g[d[d.length-2]][d[d.length-1]],d.push(u);break;case 3:return!0}}return!0}},c=function(){var a={EOF:1,parseError:function(a,b){if(!this.yy.parser)throw new Error(a);this.yy.parser.parseError(a,b)},setInput:function(a){return this._input=a,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var b=a.match(/(?:\r\n?|\n).*/g);return b?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},unput:function(a){var b=a.length,c=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-b-1),this.offset-=b;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var e=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===d.length?this.yylloc.first_column:0)+d[d.length-c.length].length-c[0].length:this.yylloc.first_column-b},this.options.ranges&&(this.yylloc.range=[e[0],e[0]+this.yyleng-b]),this},more:function(){return this._more=!0,this},less:function(a){this.unput(this.match.slice(a))},pastInput:function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var a=this.pastInput(),b=new Array(a.length+1).join("-");return a+this.upcomingInput()+"\n"+b+"^"},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,b,c,d,e;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),g=0;g<f.length&&(c=this._input.match(this.rules[f[g]]),!c||b&&!(c[0].length>b[0].length)||(b=c,d=g,this.options.flex));g++);return b?(e=b[0].match(/(?:\r\n?|\n).*/g),e&&(this.yylineno+=e.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:e?e[e.length-1].length-e[e.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+b[0].length},this.yytext+=b[0],this.match+=b[0],this.matches=b,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(b[0].length),this.matched+=b[0],a=this.performAction.call(this,this.yy,this,f[d],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a?a:void 0):""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var a=this.next();return"undefined"!=typeof a?a:this.lex()},begin:function(a){this.conditionStack.push(a)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(a){this.begin(a)}};return a.options={},a.performAction=function(a,b,c,d){function e(a,c){return b.yytext=b.yytext.substr(a,b.yyleng-c)}switch(c){case 0:if("\\\\"===b.yytext.slice(-2)?(e(0,1),this.begin("mu")):"\\"===b.yytext.slice(-1)?(e(0,1),this.begin("emu")):this.begin("mu"),b.yytext)return 14;break;case 1:return 14;case 2:return this.popState(),14;case 3:return b.yytext=b.yytext.substr(5,b.yyleng-9),this.popState(),16;case 4:return 14;case 5:return this.popState(),13;case 6:return 59;case 7:return 62;case 8:return 17;case 9:return this.popState(),this.begin("raw"),21;case 10:return 53;case 11:return 27;case 12:return 45;case 13:return this.popState(),42;case 14:return this.popState(),42;case 15:return 32;case 16:return 37;case 17:return 49;case 18:return 46;case 19:this.unput(b.yytext),this.popState(),this.begin("com");break;case 20:return this.popState(),13;case 21:return 46;case 22:return 67;case 23:return 66;case 24:return 66;case 25:return 81;case 26:break;case 27:return this.popState(),52;case 28:return this.popState(),31;case 29:return b.yytext=e(1,2).replace(/\\"/g,'"'),74;case 30:return b.yytext=e(1,2).replace(/\\'/g,"'"),74;case 31:return 79;case 32:return 76;case 33:return 76;case 34:return 77;case 35:return 78;case 36:return 75;case 37:return 69;case 38:return 71;case 39:return 66;case 40:return 66;case 41:return"INVALID";case 42:return 5}},a.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/],a.conditions={mu:{rules:[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[5],inclusive:!1},raw:{rules:[3,4],inclusive:!1},INITIAL:{rules:[0,1,42],inclusive:!0}},a}();return b.lexer=c,a.prototype=b,b.Parser=a,new a}();b["default"]=c,a.exports=b["default"]},function(a,b,c){"use strict";function d(){}function e(a,b,c){void 0===b&&(b=a.length);var d=a[b-1],e=a[b-2];return d?"ContentStatement"===d.type?(e||!c?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(d.original):void 0:c}function f(a,b,c){void 0===b&&(b=-1);var d=a[b+1],e=a[b+2];return d?"ContentStatement"===d.type?(e||!c?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(d.original):void 0:c}function g(a,b,c){var d=a[null==b?0:b+1];if(d&&"ContentStatement"===d.type&&(c||!d.rightStripped)){var e=d.value;d.value=d.value.replace(c?/^\s+/:/^[ \t]*\r?\n?/,""),d.rightStripped=d.value!==e}}function h(a,b,c){var d=a[null==b?a.length-1:b-1];if(d&&"ContentStatement"===d.type&&(c||!d.leftStripped)){var e=d.value;return d.value=d.value.replace(c?/\s+$/:/[ \t]+$/,""),d.leftStripped=d.value!==e,d.leftStripped}}var i=c(8)["default"];b.__esModule=!0;var j=c(6),k=i(j);d.prototype=new k["default"],d.prototype.Program=function(a){var b=!this.isRootSeen;this.isRootSeen=!0;for(var c=a.body,d=0,i=c.length;i>d;d++){var j=c[d],k=this.accept(j);if(k){var l=e(c,d,b),m=f(c,d,b),n=k.openStandalone&&l,o=k.closeStandalone&&m,p=k.inlineStandalone&&l&&m;k.close&&g(c,d,!0),k.open&&h(c,d,!0),p&&(g(c,d),h(c,d)&&"PartialStatement"===j.type&&(j.indent=/([ \t]+$)/.exec(c[d-1].original)[1])),n&&(g((j.program||j.inverse).body),h(c,d)),o&&(g(c,d),h((j.inverse||j.program).body))}}return a},d.prototype.BlockStatement=function(a){this.accept(a.program),this.accept(a.inverse);var b=a.program||a.inverse,c=a.program&&a.inverse,d=c,i=c;if(c&&c.chained)for(d=c.body[0].program;i.chained;)i=i.body[i.body.length-1].program;var j={open:a.openStrip.open,close:a.closeStrip.close,openStandalone:f(b.body),closeStandalone:e((d||b).body)};if(a.openStrip.close&&g(b.body,null,!0),c){var k=a.inverseStrip;k.open&&h(b.body,null,!0),k.close&&g(d.body,null,!0),a.closeStrip.open&&h(i.body,null,!0),e(b.body)&&f(d.body)&&(h(b.body),g(d.body))}else a.closeStrip.open&&h(b.body,null,!0);return j},d.prototype.MustacheStatement=function(a){return a.strip},d.prototype.PartialStatement=d.prototype.CommentStatement=function(a){var b=a.strip||{};return{inlineStandalone:!0,open:b.open,close:b.close}},b["default"]=d,a.exports=b["default"]},function(a,b,c){"use strict";function d(a,b){this.source=a,this.start={line:b.first_line,column:b.first_column},this.end={line:b.last_line,column:b.last_column}}function e(a){return/^\[.*\]$/.test(a)?a.substr(1,a.length-2):a}function f(a,b){return{open:"~"===a.charAt(2),close:"~"===b.charAt(b.length-3)}}function g(a){return a.replace(/^\{\{~?\!-?-?/,"").replace(/-?-?~?\}\}$/,"")}function h(a,b,c){c=this.locInfo(c);for(var d=a?"@":"",e=[],f=0,g="",h=0,i=b.length;i>h;h++){var j=b[h].part,k=b[h].original!==j;if(d+=(b[h].separator||"")+j,k||".."!==j&&"."!==j&&"this"!==j)e.push(j);else{if(e.length>0)throw new n["default"]("Invalid path: "+d,{loc:c});".."===j&&(f++,g+="../")}}return new this.PathExpression(a,f,e,d,c)}function i(a,b,c,d,e,f){var g=d.charAt(3)||d.charAt(2),h="{"!==g&&"&"!==g;return new this.MustacheStatement(a,b,c,h,e,this.locInfo(f))}function j(a,b,c,d){if(a.path.original!==c){var e={loc:a.path.loc};throw new n["default"](a.path.original+" doesn't match "+c,e)}d=this.locInfo(d);var f=new this.Program([b],null,{},d);return new this.BlockStatement(a.path,a.params,a.hash,f,void 0,{},{},{},d)}function k(a,b,c,d,e,f){if(d&&d.path&&a.path.original!==d.path.original){var g={loc:a.path.loc};throw new n["default"](a.path.original+" doesn't match "+d.path.original,g)}b.blockParams=a.blockParams;var h=void 0,i=void 0;return c&&(c.chain&&(c.program.body[0].closeStrip=d.strip),i=c.strip,h=c.program),e&&(e=h,h=b,b=e),new this.BlockStatement(a.path,a.params,a.hash,b,h,a.strip,i,d&&d.strip,this.locInfo(f))}var l=c(8)["default"];b.__esModule=!0,b.SourceLocation=d,b.id=e,b.stripFlags=f,b.stripComment=g,b.preparePath=h,b.prepareMustache=i,b.prepareRawBlock=j,b.prepareBlock=k;var m=c(11),n=l(m)},function(a,b,c){"use strict";function d(a,b,c){if(f.isArray(a)){for(var d=[],e=0,g=a.length;g>e;e++)d.push(b.wrap(a[e],c));return d}return"boolean"==typeof a||"number"==typeof a?a+"":a}function e(a){this.srcFile=a,this.source=[]}b.__esModule=!0;var f=c(12),g=void 0;try{}catch(h){}g||(g=function(a,b,c,d){this.src="",d&&this.add(d)},g.prototype={add:function(a){f.isArray(a)&&(a=a.join("")),this.src+=a},prepend:function(a){f.isArray(a)&&(a=a.join("")),this.src=a+this.src},toStringWithSourceMap:function(){return{code:this.toString()}},toString:function(){return this.src}}),e.prototype={prepend:function(a,b){this.source.unshift(this.wrap(a,b))},push:function(a,b){this.source.push(this.wrap(a,b))},merge:function(){var a=this.empty();return this.each(function(b){a.add(["  ",b,"\n"])}),a},each:function(a){for(var b=0,c=this.source.length;c>b;b++)a(this.source[b])},empty:function(){var a=void 0===arguments[0]?this.currentLocation||{start:{}}:arguments[0];return new g(a.start.line,a.start.column,this.srcFile)},wrap:function(a){var b=void 0===arguments[1]?this.currentLocation||{start:{}}:arguments[1];return a instanceof g?a:(a=d(a,this,b),new g(b.start.line,b.start.column,this.srcFile,a))},functionCall:function(a,b,c){return c=this.generateList(c),this.wrap([a,b?"."+b+"(":"(",c,")"])},quotedString:function(a){return'"'+(a+"").replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")+'"'},objectLiteral:function(a){var b=[];for(var c in a)if(a.hasOwnProperty(c)){var e=d(a[c],this);"undefined"!==e&&b.push([this.quotedString(c),":",e])
}var f=this.generateList(b);return f.prepend("{"),f.add("}"),f},generateList:function(a,b){for(var c=this.empty(b),e=0,f=a.length;f>e;e++)e&&c.add(","),c.add(d(a[e],this,b));return c},generateArray:function(a,b){var c=this.generateList(a,b);return c.prepend("["),c.add("]"),c}},b["default"]=e,a.exports=b["default"]}])});
},{}],28:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],29:[function(require,module,exports){
(function (global){
var cachePush = require('./cachePush'),
    getNative = require('./getNative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = SetCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cachePush":51,"./getNative":56}],30:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],31:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],32:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],33:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],34:[function(require,module,exports){
var keys = require('../object/keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = assignWith;

},{"../object/keys":80}],35:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":80,"./baseCopy":37}],36:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    initCloneArray = require('./initCloneArray'),
    initCloneByTag = require('./initCloneByTag'),
    initCloneObject = require('./initCloneObject'),
    isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

module.exports = baseClone;

},{"../lang/isArray":72,"../lang/isObject":75,"./arrayCopy":30,"./arrayEach":31,"./baseAssign":35,"./baseForOwn":42,"./initCloneArray":58,"./initCloneByTag":59,"./initCloneObject":60}],37:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],38:[function(require,module,exports){
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":43,"./cacheIndexOf":50,"./createCache":54}],39:[function(require,module,exports){
var arrayPush = require('./arrayPush'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../lang/isArguments":71,"../lang/isArray":72,"./arrayPush":33,"./isArrayLike":61,"./isObjectLike":65}],40:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":53}],41:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keysIn = require('../object/keysIn');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

module.exports = baseForIn;

},{"../object/keysIn":81,"./baseFor":40}],42:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":80,"./baseFor":40}],43:[function(require,module,exports){
var indexOfNaN = require('./indexOfNaN');

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./indexOfNaN":57}],44:[function(require,module,exports){
var arrayEach = require('./arrayEach'),
    baseMergeDeep = require('./baseMergeDeep'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike'),
    isTypedArray = require('../lang/isTypedArray'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.merge` without support for argument juggling,
 * multiple sources, and `this` binding `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {Object} Returns `object`.
 */
function baseMerge(object, source, customizer, stackA, stackB) {
  if (!isObject(object)) {
    return object;
  }
  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
      props = isSrcArr ? undefined : keys(source);

  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObjectLike(srcValue)) {
      stackA || (stackA = []);
      stackB || (stackB = []);
      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
    }
    else {
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
      }
      if ((result !== undefined || (isSrcArr && !(key in object))) &&
          (isCommon || (result === result ? (result !== value) : (value === value)))) {
        object[key] = result;
      }
    }
  });
  return object;
}

module.exports = baseMerge;

},{"../lang/isArray":72,"../lang/isObject":75,"../lang/isTypedArray":77,"../object/keys":80,"./arrayEach":31,"./baseMergeDeep":45,"./isArrayLike":61,"./isObjectLike":65}],45:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isPlainObject = require('../lang/isPlainObject'),
    isTypedArray = require('../lang/isTypedArray'),
    toPlainObject = require('../lang/toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
  var length = stackA.length,
      srcValue = source[key];

  while (length--) {
    if (stackA[length] == srcValue) {
      object[key] = stackB[length];
      return;
    }
  }
  var value = object[key],
      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
      isCommon = result === undefined;

  if (isCommon) {
    result = srcValue;
    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
      result = isArray(value)
        ? value
        : (isArrayLike(value) ? arrayCopy(value) : []);
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      result = isArguments(value)
        ? toPlainObject(value)
        : (isPlainObject(value) ? value : {});
    }
    else {
      isCommon = false;
    }
  }
  // Add the source value to the stack of traversed objects and associate
  // it with its merged value.
  stackA.push(srcValue);
  stackB.push(result);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
  } else if (result === result ? (result !== value) : (value === value)) {
    object[key] = result;
  }
}

module.exports = baseMergeDeep;

},{"../lang/isArguments":71,"../lang/isArray":72,"../lang/isPlainObject":76,"../lang/isTypedArray":77,"../lang/toPlainObject":78,"./arrayCopy":30,"./isArrayLike":61}],46:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],47:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],48:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":86}],49:[function(require,module,exports){
(function (global){
/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

module.exports = bufferClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],50:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

module.exports = cacheIndexOf;

},{"../lang/isObject":75}],51:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

module.exports = cachePush;

},{"../lang/isObject":75}],52:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall'),
    restParam = require('../function/restParam');

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../function/restParam":28,"./bindCallback":48,"./isIterateeCall":63}],53:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":69}],54:[function(require,module,exports){
(function (global){
var SetCache = require('./SetCache'),
    getNative = require('./getNative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
function createCache(values) {
  return (nativeCreate && Set) ? new SetCache(values) : null;
}

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./SetCache":29,"./getNative":56}],55:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":46}],56:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":74}],57:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],58:[function(require,module,exports){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],59:[function(require,module,exports){
var bufferClone = require('./bufferClone');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

module.exports = initCloneByTag;

},{"./bufferClone":49}],60:[function(require,module,exports){
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

module.exports = initCloneObject;

},{}],61:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":55,"./isLength":64}],62:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],63:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":75,"./isArrayLike":61,"./isIndex":62}],64:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],65:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],66:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * A specialized version of `_.pick` which picks `object` properties specified
 * by `props`.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property names to pick.
 * @returns {Object} Returns the new object.
 */
function pickByArray(object, props) {
  object = toObject(object);

  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

module.exports = pickByArray;

},{"./toObject":69}],67:[function(require,module,exports){
var baseForIn = require('./baseForIn');

/**
 * A specialized version of `_.pick` which picks `object` properties `predicate`
 * returns truthy for.
 *
 * @private
 * @param {Object} object The source object.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Object} Returns the new object.
 */
function pickByCallback(object, predicate) {
  var result = {};
  baseForIn(object, function(value, key, object) {
    if (predicate(value, key, object)) {
      result[key] = value;
    }
  });
  return result;
}

module.exports = pickByCallback;

},{"./baseForIn":41}],68:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":71,"../lang/isArray":72,"../object/keysIn":81,"./isIndex":62,"./isLength":64}],69:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":75}],70:[function(require,module,exports){
var baseClone = require('../internal/baseClone'),
    bindCallback = require('../internal/bindCallback');

/**
 * Creates a deep clone of `value`. If `customizer` is provided it is invoked
 * to produce the cloned values. If `customizer` returns `undefined` cloning
 * is handled by the method instead. The `customizer` is bound to `thisArg`
 * and invoked with two argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var deep = _.cloneDeep(users);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.cloneDeep(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(true);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 20
 */
function cloneDeep(value, customizer, thisArg) {
  return typeof customizer == 'function'
    ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
    : baseClone(value, true);
}

module.exports = cloneDeep;

},{"../internal/baseClone":36,"../internal/bindCallback":48}],71:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":61,"../internal/isObjectLike":65}],72:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":56,"../internal/isLength":64,"../internal/isObjectLike":65}],73:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":75}],74:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":65,"./isFunction":73}],75:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],76:[function(require,module,exports){
var baseForIn = require('../internal/baseForIn'),
    isArguments = require('./isArguments'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * **Note:** This method assumes objects created by the `Object` constructor
 * have no inherited enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  var Ctor;

  // Exit early for non `Object` objects.
  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  // IE < 9 iterates inherited properties before own properties. If the first
  // iterated property is an object's own property then there are no inherited
  // enumerable properties.
  var result;
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  baseForIn(value, function(subValue, key) {
    result = key;
  });
  return result === undefined || hasOwnProperty.call(value, result);
}

module.exports = isPlainObject;

},{"../internal/baseForIn":41,"../internal/isObjectLike":65,"./isArguments":71}],77:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":64,"../internal/isObjectLike":65}],78:[function(require,module,exports){
var baseCopy = require('../internal/baseCopy'),
    keysIn = require('../object/keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable
 * properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return baseCopy(value, keysIn(value));
}

module.exports = toPlainObject;

},{"../internal/baseCopy":37,"../object/keysIn":81}],79:[function(require,module,exports){
var assignWith = require('../internal/assignWith'),
    baseAssign = require('../internal/baseAssign'),
    createAssigner = require('../internal/createAssigner');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"../internal/assignWith":34,"../internal/baseAssign":35,"../internal/createAssigner":52}],80:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":56,"../internal/isArrayLike":61,"../internal/shimKeys":68,"../lang/isObject":75}],81:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":62,"../internal/isLength":64,"../lang/isArguments":71,"../lang/isArray":72,"../lang/isObject":75}],82:[function(require,module,exports){
var baseMerge = require('../internal/baseMerge'),
    createAssigner = require('../internal/createAssigner');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * overwrite property assignments of previous sources. If `customizer` is
 * provided it is invoked to produce the merged values of the destination and
 * source properties. If `customizer` returns `undefined` merging is handled
 * by the method instead. The `customizer` is bound to `thisArg` and invoked
 * with five arguments: (objectValue, sourceValue, key, object, source).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 *
 * // using a customizer callback
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(object, other, function(a, b) {
 *   if (_.isArray(a)) {
 *     return a.concat(b);
 *   }
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var merge = createAssigner(baseMerge);

module.exports = merge;

},{"../internal/baseMerge":44,"../internal/createAssigner":52}],83:[function(require,module,exports){
var arrayMap = require('../internal/arrayMap'),
    baseDifference = require('../internal/baseDifference'),
    baseFlatten = require('../internal/baseFlatten'),
    bindCallback = require('../internal/bindCallback'),
    keysIn = require('./keysIn'),
    pickByArray = require('../internal/pickByArray'),
    pickByCallback = require('../internal/pickByCallback'),
    restParam = require('../function/restParam');

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable properties of `object` that are not omitted.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {Function|...(string|string[])} [predicate] The function invoked per
 *  iteration or property names to omit, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'user': 'fred', 'age': 40 };
 *
 * _.omit(object, 'age');
 * // => { 'user': 'fred' }
 *
 * _.omit(object, _.isNumber);
 * // => { 'user': 'fred' }
 */
var omit = restParam(function(object, props) {
  if (object == null) {
    return {};
  }
  if (typeof props[0] != 'function') {
    var props = arrayMap(baseFlatten(props), String);
    return pickByArray(object, baseDifference(keysIn(object), props));
  }
  var predicate = bindCallback(props[0], props[1], 3);
  return pickByCallback(object, function(value, key, object) {
    return !predicate(value, key, object);
  });
});

module.exports = omit;

},{"../function/restParam":28,"../internal/arrayMap":32,"../internal/baseDifference":38,"../internal/baseFlatten":39,"../internal/bindCallback":48,"../internal/pickByArray":66,"../internal/pickByCallback":67,"./keysIn":81}],84:[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to search.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search from.
 * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = baseToString(string);
  target = (target + '');

  var length = string.length;
  position = position === undefined
    ? length
    : nativeMin(position < 0 ? 0 : (+position || 0), length);

  position -= target.length;
  return position >= 0 && string.indexOf(target, position) == position;
}

module.exports = endsWith;

},{"../internal/baseToString":47}],85:[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Checks if `string` starts with the given target string.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to search.
 * @param {string} [target] The string to search for.
 * @param {number} [position=0] The position to search from.
 * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
 * @example
 *
 * _.startsWith('abc', 'a');
 * // => true
 *
 * _.startsWith('abc', 'b');
 * // => false
 *
 * _.startsWith('abc', 'b', 1);
 * // => true
 */
function startsWith(string, target, position) {
  string = baseToString(string);
  position = position == null
    ? 0
    : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

  return string.lastIndexOf(target, position) == position;
}

module.exports = startsWith;

},{"../internal/baseToString":47}],86:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],87:[function(require,module,exports){
(function (global){
/**
 *
 * Essential extension methods for Promises/A+ implementations
 */

var setImmediate = (function setImmediateImpl() {
    'use strict';

    if (setImmediate) {
        return setImmediate;
    } else if ({}.toString.call(global.process) === '[object process]') {
        return global.process.nextTick.bind(global.process);
    } else {
        return function(handler) {
            setTimeout(handler, 0);
        };
    }
}());

var convertToArray = (function() {
    'use strict';
    var toArray = Array.prototype.slice;
    return function $convertToArray(obj) {
        return obj ? toArray.call(obj) : [];
    };
})();

function createInspectionObject(resolved, valueOrReason) {
    'use strict';

    var insp = {
        isRejected: function() {
            return !resolved;
        },
        isFulfilled: function() {
            return resolved;
        }
    };
    // alias
    insp.isResolved = insp.isFulfilled;

    if (resolved) {
        Object.defineProperty(insp, 'value', {
            enumerable: true,
            value: valueOrReason
        });
    } else {
        Object.defineProperty(insp, 'reason', {
            enumerable: true,
            value: valueOrReason
        });
    }

    return insp;
}

function applyExtensions(Promise) {
    'use strict';

    // spread method
    Promise.prototype.spread = function (fn) {
        return this.then(function (args) {
            return Promise.all(args);
        }).then(function (array) {
            return fn.apply(null, array);
        });
    };

    // delay method
    Promise.prototype.delay = function (timeout) {
        return this.then(function(args) {
            return new Promise(function (resolve) {
                setTimeout(function() {
                    resolve(args);
                }, timeout);
            });
        });
    };

    // static delay method
    Promise.delay = function (resolveValue, timeout) {
        if (timeout === undefined) {
            timeout = resolveValue;
            resolveValue = undefined;
        }
        return this.resolve(resolveValue).delay(timeout);
    };

    // finally method
    Promise.prototype['finally'] = function (fn) {
        var noop = function() {};
        var fnAsPromise = new Promise(function(resolve) {
            var val;
            try {
                val = fn();
            } finally {
                resolve(val);
            }
        }).then(noop, noop);

        return this.then(function (value) {
            return fnAsPromise.then(function () {
                return value;
            });
        }, function(reason) {
            return fnAsPromise.then(function() {
                throw reason;
            });
        });
    };

    // reflect method
    Promise.prototype.reflect = function () {
        return this.then(function(value) {
            return createInspectionObject(true, value);
        }, function(reason) {

            return createInspectionObject(false, reason);
        });
    };

    // static settleAll method
    Promise.settleAll = function(array) {
        var values = Array.isArray(array) ? array : [array];
        return this.all(values.map(function(value) {
            return Promise.resolve(value).reflect();
        }));
    };

    // done method
    Promise.prototype.done = function() {
        this.catch(function (error) {
            setImmediate(function() {
                throw error;
            });
        });
    };

    return Promise;
}

function delegateToInstance(decorator, methods) {
    'use strict';

    methods.forEach(function(method) {
        decorator.prototype[method] = function () {
            var ins = this.__instance;
            var promise = ins[method].apply(ins, convertToArray(arguments));
            return decorator.resolve(promise);
        };
    });
}

function delegateToStatic(decorator, delegate, methods) {
    'use strict';

    methods.forEach(function(method) {
        decorator[method] = function () {
            var promise = delegate[method].apply(delegate, convertToArray(arguments));
            return decorator.resolve(promise);
        };
    });
}

function decorate(promiseFunc) {
    'use strict';

    var PromiseExtensions = function PromiseExtensions(executor) {
        var promise = new promiseFunc(executor);
        // protect base instance from tampering with
        Object.defineProperty(this, '__instance', {
            value: promise
        });
    };

    // resolve method doesn't delegate to original Promise. Other methods heavily rely on it.
    PromiseExtensions.resolve = function resolve(msg) {
        var Constructor = this;
        if (msg && msg.__instance && typeof msg.__instance === 'object') {
            return msg;
        }

        return new Constructor(function(resolve) {
            resolve(msg);
        });
    };

    // delegate known static methods to provided impl
    delegateToStatic(PromiseExtensions, promiseFunc, ['all', 'reject', 'race']);
    // delegate known instance methods to base instance
    delegateToInstance(PromiseExtensions, ['then', 'catch']);
    // define extension methods
    return applyExtensions(PromiseExtensions);
}

module.exports = function(promiseImpl) {
    'use strict';

    var Promise = promiseImpl || global.Promise;
    if (!Promise) {
        throw new Error('No Promise implementation found.');
    }
    if (typeof Promise !== 'function') {
        throw new TypeError('Not supported. The argument provided is not a constructor.');
    }

    return decorate(Promise);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],88:[function(require,module,exports){
/**
 * Config Aggregator
 * @module core/config-aggregator
 * @exports {ConfigAggregator} The constructor
 */

'use strict';

var util = require('../util/util');
var loggerFactory = require('../util/logger-factory');
var bunyan = require('browser-bunyan');
var defaultWidgetModel = require('./default-widget-model');

/**
 * A <code>ConfigAggregator</code> is used to combine zero or more models into one.
 * @constructor
 */
var ConfigAggregator = function() {
    this.log = loggerFactory.getLogger();
};

/**
 * Combines an array of zero or models into one. A default widget model is always used as a base.
 * @param {Object[]} models An array of widget models
 * @returns {Object} A single widget model
 */
ConfigAggregator.prototype.combine = function(models) {

    var log = this.log;

    var combinedModel = util.cloneDeep(defaultWidgetModel);
    models.forEach(function(model) {
        //merge all other properties
        util.merge(combinedModel, util.omit(model, ['preferences', 'viewmodes']));

        //merges viewmodes in the combined
        if(util.isArray(model.viewmodes)) {
            model.viewmodes.forEach(function(viewmode) {
                if(combinedModel.viewmodes.indexOf(viewmode) < 0) {
                    combinedModel.viewmodes.push(viewmode);
                }
            });
        }

        //merge preferences into combined
        if(util.isArray(model.preferences)) {
            model.preferences.forEach(function(pref) {
                var prefFound = false;
                for(var i = 0; i < combinedModel.preferences.length && !prefFound; i++) {
                    if(combinedModel.preferences[i].name === pref.name) {
                        util.merge(combinedModel.preferences[i], pref);
                        prefFound = true;
                    }
                }
                if(!prefFound) {
                    combinedModel.preferences.push(util.cloneDeep(pref));
                }
            });
        }
    });

    log.debug('Aggregated model created.');
    if(log.level() <= bunyan.TRACE) {
        log.trace('Aggregated model is this:\n %s', JSON.stringify(combinedModel, null, '\t'));
    }

    return combinedModel;
};

module.exports = ConfigAggregator;

},{"../util/logger-factory":121,"../util/util":123,"./default-widget-model":91,"browser-bunyan":1}],89:[function(require,module,exports){
/* jshint unused: vars */

/**
 * Config Parser
 * @module core/config-parser
 * @exports {ConfigParser} The constructor
 */
'use strict';

/**
 * A <code>ConfigParser</code> is used to parse a string of data into a widget model
 * @interface
 * @constructor
 * @param {Object} opts Configuration options to initialize with
 * @param {Object} [opts.log] A logger object to use. Defaults to a default logger object
 */
var ConfigParser = function(opts) {};

/**
 * Parses widget config text into a widget model
 * @method
 * @abstract
 * @param {string} configText The text to parse
 * @return {Object} A widget model
 */
ConfigParser.prototype.parse = function(configText) {
    throw new Error('ConfigParser#parse must be overridden.');
};

module.exports = ConfigParser;
},{}],90:[function(require,module,exports){
/* jshint unused: vars */

/**
 * Config Reaser
 * @module core/config-reader
 * @exports {ConfigReader} The constructor
 */

'use strict';

/**
 * A <code>ConfigReader</code> is used to read widget configuration from a source
 * @interface
 * @constructor
 * @param {Object} opts Configuration options to initialize with
 * @param {Object} [opts.useCache] Instructs the reader to cache the widget configuration string
 */
var ConfigReader = function(opts) {
};

/**
 * Reads the config text
 * @param location
 * @returns {Promise} Resolves to a widget model
 */
ConfigReader.prototype.read = function(location) {

    throw new Error('ConfigReader#read must be overridden.');
};

module.exports = ConfigReader;
},{}],91:[function(require,module,exports){
/**
 * Default Widget Model
 * @module core/default-widget-model
 * @exports {Object} The default widget model
 */

'use strict';

//this is the default widget model used as a base for various things
var widgetModel = {
    'id' : null,
    'version' : null,
    'height' : null,
    'width' : null,
    'viewmodes' : [ ],
    'name' : null,
    'shortName' : null,
    'description' : null,
    'author' : null,
    'authorHref' : null,
    'authorEmail' : null,
    'preferences' : [],
    'license' : null,
    'licenseHref' : null,
    'icons' : [ ],
    'content' : {
        'src' : 'index.html',
        'type' : 'text/html',
        'encoding' : 'UTF-8'
    },
    'features' : []
};

module.exports = widgetModel;
},{}],92:[function(require,module,exports){
/**
 * Pre-processing Renderer
 * Abstract helper class for adding pre-processing functionality to widget renderer strategies
 * This module expects the strategy author to overwrite two template methods:
 * <code>fetchStartFile</code> and <code>process</code>
 * @module core/pre-processing-widget-renderer
 */

'use strict';

var WidgetRenderer = require('./widget-renderer');
var loggerFactory = require('../util/logger-factory');
var util = require('../util/util');
var PromiseExt = require('promise-extensions')(Promise);
var ModelExpressionInterpreter = require('../util/model-expression-interpreter');

/**
 * Constructs a new <code>PreprocessingRenderer</code>
 * @interface
 * @constructor
 * @abstract
 */
var PreprocessingWidgetRenderer = function() {
    this.preprocessorMap = {};
    this.log = loggerFactory.getLogger();
};

PreprocessingWidgetRenderer.prototype = Object.create(WidgetRenderer.prototype);

/**
 * Renders a widget. This calls the template methods <code>fetchStartFile</code> and <code>process</code>
 * in sequence.
 * @final
 * @param {string} path The widget path
 * @param {Object} widgetModel The model of the widget to be rendered
 * @param {Object} widgetInstance The widget instance of the widget to be rendered
 * @returns {Promise}
 */
PreprocessingWidgetRenderer.prototype.render = function(path, widgetModel, widgetInstance) {

    var self = this;

    try {
        //TODO: this should be temporary until https://backbase.atlassian.net/browse/BACKLOG-11882 is done
        widgetModel.preferences.forEach(function (pref) {
            Object.defineProperty(widgetModel.preferences, pref.name, {
                value: pref,
                writable: false,
                enumerable: false,
                configurable: true
            });
        });
        
        //fetch datasources
        var datasources = Object.keys(widgetModel.datasources || {}).map(function (name) {

            var datasource = widgetModel.datasources[name];
            var context = util.assign({}, widgetModel);

            //interpret value expressions ( ${preferences.title.value}
            var interpreter = new ModelExpressionInterpreter(context);
            datasource.params = datasource.params.map(function (param) {
                return {
                    name: param.name,
                    value: interpreter.run(param.value)
                };
            });

            return self._fetchDatasource(datasource);
        });
        var datasourcesPromise = PromiseExt.all(datasources);

        //look for a message bundle reference
        var messageBundlePreference = widgetModel.preferences.filter(function (preference) {
            return preference.name === 'messages';
        })[0];
        var messageBundleUrl = messageBundlePreference && messageBundlePreference.value;
        var messageBundlePromise = messageBundleUrl ? this._fetchJson(messageBundleUrl) : {};

        //get the start file (template method)
        var startFilePromise = this.fetchStartFile(path, widgetModel, widgetInstance);

        //rendering process
        return PromiseExt.all([startFilePromise, datasourcesPromise, messageBundlePromise])
            .spread(function(startFile, datasources, messageBundle) {
                //combine datasources into one object
                var data = datasources.reduce(function (obj, datasource) {
                    obj[datasource.name] = datasource.data;
                    return obj;
                }, {});

                var renderingContext = util.assign({}, widgetModel, { datasources: data });

                return PromiseExt.resolve(self.preprocess(widgetModel, startFile, renderingContext, messageBundle));
            }).then(function (startFile) {
                return PromiseExt.resolve(self.process(widgetModel, widgetInstance, startFile));
            });
    } catch(err) {
        return PromiseExt.reject(err);
    }
};

/**
 * Fetch json
 * @param url
 * @return {*}
 * @private
 */
PreprocessingWidgetRenderer.prototype._fetchJson = function (url) {
    var fetchFunction = util.isUrlForFile(url) ? require('../util/fetch-file') : fetch;
    return fetchFunction(url).then(function (response) {
        return response.json();
    });
};

/**
 * Fetch given datasource from server
 * @param {Object} datasource
 * @param {String} datasource.name
 * @param {String} datasource.uri
 * @param {{name: string, value: *}[]} datasource.params
 */
PreprocessingWidgetRenderer.prototype._fetchDatasource = function (datasource) {
    var url = this._buildDatasourceUrl(datasource);

    return this._fetchJson(url).then(function (json) {
        return { name: datasource.name, data: json };
    });
};

/**
 * @param {Object} datasource
 * @param {String} datasource.name
 * @param {String} datasource.uri
 * @return {String}
 */
PreprocessingWidgetRenderer.prototype._buildDatasourceUrl = function (datasource) {
    var uri = datasource.uri;
    var params = datasource.params;

    var endpoint = uri;
    var hasQueryParams = uri.indexOf('?') >= 0;
    var encodedParams = '';

    if (params && params.length > 0) {
        encodedParams = params.map(function (param) {
            return encodeURIComponent(param.name) + '=' + encodeURIComponent(param.value);
        }).join('&');

        endpoint += (hasQueryParams ? '&' : '?') + encodedParams;
    }

    return endpoint;
};

/**
 * Template method to fetch a start file. Return either the contents of a start file or a promise which
 * resolves to the contents of a start file
 * @param {string} path The path of the widget
 * @param {Object} widgetModel The model of the widget to be rendered
 * @param {Object} widgetInstance The widget instance of the widget to be rendered
 */
PreprocessingWidgetRenderer.prototype.fetchStartFile = function(path, widgetModel, widgetInstance) {

    throw new Error('PreprocessingRenderer#fetchStartFile must be overridden.');
};

/**
 * Applies the registered preprocessors to a start file.
 * The preprocessor must have been registered with a mime type that matches the mime type of the start file
 * @private
 * @param {Object} widgetModel The widget model
 * @param {String} startFileContent The raw start file content to process
 * @param {String} data The data/context
 * @param {Object} messageBundle
 * @returns {Promise}
 */
PreprocessingWidgetRenderer.prototype.preprocess = function(widgetModel, startFileContent, data, messageBundle) {

    var mimeType = widgetModel.content.type;
    if(startFileContent && this.preprocessorMap.hasOwnProperty(mimeType)) {
        var processor = this.preprocessorMap[mimeType];
        this.log.debug('Applying preprocessor for [%s] for [%s (%s)] ', processor.name, widgetModel.content.src,
                       mimeType);
        return processor.process(widgetModel, startFileContent, data, messageBundle);
    } else {
        return startFileContent;
    }
};

/**
 * Does main rendering processing after a start file has been fetched and preprocessed
 * @param {Object} widgetModel The model of the widget to be rendered
 * @param {Object} widgetInstance The widget instance of the widget to be rendered
 * @param {String} startFileHtml The contents of the widget's start file
 * @param {String} startFileDir The actual path of the start file (after considering folder localization etc)
 */
PreprocessingWidgetRenderer.prototype.process = function(widgetModel, widgetInstance, startFileHtml, startFileDir) {

    throw new Error('PreprocessingRenderer#process must be overridden.');
};

/**
 * Adds a preprocessor to the renderer
 * @param {String} mimeType This preprocessor will be applied to start files which have this mimetype
 * @param {Object} preprocessor Apply this preprocessor for start files with a matching mime typeg
 */
PreprocessingWidgetRenderer.prototype.addPreprocessor = function(mimeType, preprocessor) {
    if(this.preprocessorMap.hasOwnProperty(mimeType)) {
        var oldProcessor = this.preprocessorMap[mimeType].name;
        this.log.warn('Overriding a previously added preprocessor [%s] for the mime type [%s]', oldProcessor, mimeType);
    }

    preprocessor.name = preprocessor.name || 'Anonymous preprocessor';
    this.log.debug('Adding the preprocessor [%s] for start files with the mime type [%s]', preprocessor.name, mimeType);
    this.preprocessorMap[mimeType] = preprocessor;
};

module.exports = PreprocessingWidgetRenderer;

},{"../util/fetch-file":119,"../util/logger-factory":121,"../util/model-expression-interpreter":122,"../util/util":123,"./widget-renderer":98,"promise-extensions":87}],93:[function(require,module,exports){
/**
 * Tne Widget Engine
 * @module core/widget-engine
 * @wxports {WidgetEngine}
 */

'use strict';

var ExtPromise = require('promise-extensions')(Promise);
var util = require('../util/util');
var loggerFactory = require('../util/logger-factory');
var WidgetRenderer = require('./widget-renderer');
var ConfigReader = require('./config-reader');
var ConfigParser = require('./config-parser');
var WidgetStorage = require('./widget-storage');
var WidgetInstanceFactory = require('./widget-instance-factory');
var WidgetFeatureAugmenter = require('./widget-feature-augmenter');
var ConfigAggregator = require('./config-aggregator');
var WidgetError = require('./widget-error');

var pluginPhases = {
    POST_READ: 'postRead',
    PRE_RENDER: 'preRender',
    POST_RENDER: 'postRender'
};

var mimeTypes = {
    html : 'text/html',
    hbs : 'text/x-handlebars-template',
    handlebars: 'text/x-handlebars-template',
    'soy.js': 'application/x-soy',
    'hbs.js': 'application/x-handlebars-template'
};

/**
 * The widget engine.
 * Uses supplied strategies and config to resolve and run a widget
 * @param {Object} config The configuration options to initiailze the widget engine with
 * @param {String} config.widgetPath A base path of the widget (without a file name)
 * @param {String} [config.configFile] The name of the config file to parse the widget meta data from. Usuatlly defaults
 *                                   to 'config.xml'
 * @param {Object} config.reader The reader strategy to use
 * @param {object} config.storage The storage strategy to use
 * @param {Object} config.renderer The rendering strategy to use
 * @param {String} [config.locale] The locale the renderered widget will be associated with for i18n purpose
 * @param {Object} [config.initialModel] Feed a widgetr model directly into the engine
 * @param {Object} [config.log] A Bunyan logger to log messages with
 * @param {String} [config.initialId] A unique id to associate this widget with. This is declared externally so it can
 *                                    be shared with the externally defined logger
 * @constructor
 */
var WidgetEngine = function(config) {
    this.config = config;
    this.locale = this.config.locale || null;

    this.plugins = [];
    this.features = [];

    //stateless tools
    this.widgetInstanceFactory = new WidgetInstanceFactory();
    this.widgetFeatureAugmenter = new WidgetFeatureAugmenter();

    this.log = loggerFactory.getLogger();

    var failureMessages = validateConfig(this.config);
    if(failureMessages.warnings.length) {
        this.log.warn(failureMessages.warnings.join('\n'));
    }
    if(failureMessages.errors.length) {
        var message = 'Problems with widget config:\n\t' + failureMessages.errors.join('\t\n');
        throw new WidgetError(message);
    }
};

/**
 * Starts the widget rendering process
 * @method
 * @returns {Promise} promise that resolves when complete
 */
WidgetEngine.prototype.start = function() {

    var startTime = new Date().getTime();

    var log = this.log;
    var config = this.config;
    var locale = this.locale;
    var plugins = this.plugins;
    var features = this.features;
    var initialModel = config.initialModel || {};
    var widgetPath = config.widgetPath;
    var configFile = config.configFile || 'config.xml';

    //convert empty strings urls to . to force the path as the current directory and not a falsy value
    if(widgetPath === '') {
        widgetPath = '.';
    }

    var widgetInstanceFactory = this.widgetInstanceFactory;
    var widgetFeatureAugmenter = this.widgetFeatureAugmenter;

    log.info('Starting widget @ %s...', widgetPath);
    log.info('Entering READ phase.');

    //READ PHASE
    //read the widget config
    var result = Promise.resolve({});

    if(config.reader) {
        result = result.then(function() {
            var resolvedConfigFile =
                (util.endsWith(widgetPath, '/') ? widgetPath : widgetPath + '/') + configFile;
            return config.reader.read(resolvedConfigFile);
        });
    }
    if(config.parser) {
        result = result.then(function(configText) {
            return config.parser.parse(configText);
        });
    }

    return ExtPromise.all([initialModel, result]).then(function aggregateModels(configModels) {
        log.debug('Aggregating models...');
        var configAggregator = new ConfigAggregator({
            log: log
        });
        return configAggregator.combine(configModels);
    }).then(function postRead(widgetModel) {

        //in older widget models the meta data might not allow a mime type to be specified, this guesses the mime type
        //based on the file extension of the start file.
        //this could potentially be implemented as a post-read plugin, but that seems overkill for this case.
        //if the mime type is not the default value (text/html) do not try to guess it
        if(!widgetModel.content.type  || widgetModel.content.type === mimeTypes.html) {
            widgetModel.content.type = guessContentType(widgetModel);
            log.debug('The start file type was inferred as [%s]', widgetModel.content.type);
        }

        log.info('Invoking plugins for POST READ phase...');
        //POST READ PHASE. Plugins must return a widgetModel
        return invokePluginsForPhase(plugins, log, pluginPhases.POST_READ, [ widgetModel ]);
    }).spread(function createInstance(widgetModel) {

        log.info('Widget config read for: %s (%s).', widgetModel.id, widgetModel.name);
        log.info('Entering INSTANCE CREATION phase...');

        //INSTANCE CREATION PHASE
        var renderer = config.renderer;
        var storage = config.storage;

        //ensure an id is present for standalone environments where it may not have been populated with a UUID
        widgetModel.id = widgetModel.id || util.randomId();

        //init storage
        storage.init(widgetModel.name, widgetModel.preferences, widgetModel.type);
        log.debug('Widget storage initialized.');

        //create a widget instance (needs renderer for width and height functions)
        var widgetInstance = widgetInstanceFactory.makeWidget(widgetModel, storage, renderer, locale);
        log.debug('Widget instance created.');

        //add features to the widget instance. Features are initiated with a widgetmodel for advanced ops
        widgetFeatureAugmenter.addFeaturesToWidget(widgetInstance, features, widgetModel);
        log.debug('%s feature(s) added to widget.', features.length);

        return [widgetInstance, renderer, widgetModel];
    }).spread(function preRender(widgetInstance, renderer, widgetModel) {
        //PRE RENDER PHASE
        log.info('Invoking plugins for PRE RENDER phase...');
        var widgetPluginPromises =
            invokePluginsForPhase(plugins, log, pluginPhases.PRE_RENDER, [ widgetInstance, renderer, widgetModel ]);
        return widgetPluginPromises;
    }).spread(function render(widgetInstance, renderer, widgetModel) {
        log.info('Entering RENDERING phase...');
        //RENDERING PHASE
        var renderingPromise = renderer.render(widgetPath, widgetModel, widgetInstance);
        return [ widgetInstance, renderer, widgetModel, renderingPromise ];
    }).spread(function postRender(widgetInstance, renderer, widgetModel) {
        log.info('Invoking plugins for POST RENDER phase...');
        //POST RENDER PHASE. Plugins are not expected to return a value
        var widgetPluginPromises =
            invokePluginsForPhase(plugins, log, pluginPhases.POST_RENDER, [ widgetInstance, renderer, widgetModel ]);
        return widgetPluginPromises;
    }).spread(function renderingComplete(widgetInstance, renderer, widgetModel) {
        var details = {};
        var endTime = new Date().getTime();
        details.time = endTime - startTime;
        details.id = widgetModel.id;
        details.message = 'Widget rendering for [' + widgetModel.name + '] completed in ' + details.time + 'ms.';
        details.areaNodes = typeof renderer.getAreaNodes === 'function' ? renderer.getAreaNodes() : null;
        log.info(details.message);
        return details;
    }).catch(function (e) {
        log.error(e);
        throw new WidgetError(e, 'An error occurred whilst starting the widget.');
    });
};

/**
 * Adds a new feature
 * @param {Object} feature
 * @returns {WidgetEngine} Returns this. Convenient for chaining
 */
WidgetEngine.prototype.addFeature = function (feature) {

    this.log.info('Adding feature for widget, %s', (feature.name || '[Anonymous feature]'));
    if(typeof feature === 'object') {
        this.features.push(feature);
    }
    return this;
};

/**
 * Adds a plugin
 * @param {Object} plugin
 * @returns {WidgetEngine} Returns this. Convenient for chaining
 */
WidgetEngine.prototype.addPlugin = function (plugin) {

    this.log.info('Adding plugin for widget, %s', (plugin.name || '[Anonymous plugin]'));
    if(typeof plugin === 'object') {
        this.plugins.push(plugin);
    }
    return this;
};

/**
 * @see core/widget-renderer#destroy
 */
WidgetEngine.prototype.destroy = function () {
    // Call each plugin's destroy method
    this.plugins.forEach(function (plugin) {
        if (typeof plugin.destroy === 'function') {
            plugin.destroy();
        }
    });

    this.config.renderer.destroy();
};

var validateConfig = function(config) {

    var messages = {
        warnings: [],
        errors: []
    };

    //widgetpath
    if(typeof config.widgetPath !== 'string') {
        messages.errors.push('You must supply a valid widget path');
    } else if(config.widgetPath.indexOf('config.xml') >= 0) {
        messages.errors.push('Please supply the base path of your widget, not its config.xml path');
    }

    if(!config.initialModel && !config.reader) {
        messages.warnings.push('No initial model or widget reader was provided. Can\'t get any config');
    }

    if(config.reader && !config.parser) {
        messages.warnings.push('A widget reader was provided, but not a widget config parser');
    }

    if(config.reader && !(config.reader instanceof ConfigReader)) {
        messages.warnings.push('The configured widget reader might not be a valid ConfigReader instance');
    }

    if(config.parser && !(config.parser instanceof ConfigParser)) {
        messages.warnings.push('The configured widget parser might not be a valid ConfigParser instance');
    }

    //storage
    if(!config.storage) {
        messages.errors.push('No widget storage is configured');
    } else if(!(config.storage instanceof WidgetStorage)) {
        messages.warnings.push('The configured widget storage might not be a valid WidgetStorage instance');
    }

    //renderer
    if(!config.renderer) {
        messages.errors.push('No widget renderer is configured');
    } else if(!(config.renderer instanceof WidgetRenderer)) {
        messages.warnings.push('The configured widget renderer might not be a valid WidgetRenderer instance');
    }

    return messages;
};

var invokePluginsForPhase = function(plugins, log, phase, pluginArgs) {

    var result = ExtPromise.all(pluginArgs);

    //loop through the plugins and sequentially invoke the plugin function for the current phase
    plugins.filter(function(plugin) {
        return typeof plugin[phase] === 'function';
    }).forEach(function(plugin) {
        var pluginName = plugin.name || 'Anonymous plugin';
        var lastArgs;

        result = result.then(function(args) { // args is always an array
            lastArgs = args;
            var promise = plugin[phase].apply(plugin, args);

            return [promise, args];
        }).spread(function(pluginReturnValue, args) {

            // if plugin returned nothing, fallback to arguments it was provided with
            // otherwise we assume it returned what it got as the first argument
            return pluginReturnValue === undefined ? args : [pluginReturnValue].concat(args.slice(1));
        }).catch(function(e) {
            // recover from failure, so that one failed plugin doesn't ruin widget rendering
            var message = 'Failed to invoke plugin [' + pluginName + '] for [' + phase + ']';
            log.error(e, message);

            // keep running plugins with what last successfully invoked plugin returned
            return lastArgs;
        });
    });

    return result;
};

var guessContentType = function(widgetModel) {
    var results = widgetModel.content.src.match(/\.([A-z0-9]+)$/);
    return results && results[1] && mimeTypes[results[1]] || widgetModel.content.type;
};

module.exports = WidgetEngine;

},{"../util/logger-factory":121,"../util/util":123,"./config-aggregator":88,"./config-parser":89,"./config-reader":90,"./widget-error":95,"./widget-feature-augmenter":96,"./widget-instance-factory":97,"./widget-renderer":98,"./widget-storage":99,"promise-extensions":87}],94:[function(require,module,exports){
/**
 * Widget Error Codes
 * @module core/widget-error-codes
 * @exports {Object}
 */

'use strict';

module.exports = {
    /**
     * Used when a widget renderer receives 'Not found' response to a request of widget start file
     * @type {string}
     * @readonly
     */
    STARTFILE_NOT_FOUND: 'STARTFILE_NOT_FOUND'
};

},{}],95:[function(require,module,exports){
// This code is a modification of the VError (https://github.com/davepacheco/node-verror)
// It contains the following simplifications to be optimized for the browser
// * no printf style arguments, instead multiple arguments after the wrapped error are joined into one string

/* jshint ignore:start */
/*
 * VError([cause], fmt[, arg...]): Like JavaScript's built-in Error class, but
 * supports a "cause" argument (another error) and a printf-style message.  The
 * cause argument can be null or omitted entirely.
 *
 * Examples:
 *
 * CODE                                    MESSAGE
 * new VError('something bad happened')    "something bad happened"
 * new VError('missing file: "%s"', file)  "missing file: "/etc/passwd"
 *   with file = '/etc/passwd'
 * new VError(err, 'open failed')          "open failed: file not found"
 *   with err.message = 'file not found'
 */
function VError(options)
{
    var args, obj, causedBy, ctor, tailmsg;

    /*
     * This is a regrettable pattern, but JavaScript's built-in Error class
     * is defined to work this way, so we allow the constructor to be called
     * without "new".
     */
    if (!(this instanceof VError)) {
        args = Array.prototype.slice.call(arguments, 0);
        obj = Object.create(VError.prototype);
        VError.apply(obj, arguments);
        return (obj);
    }

    if (options instanceof Error || typeof (options) === 'object') {
        args = Array.prototype.slice.call(arguments, 1);
    } else {
        args = Array.prototype.slice.call(arguments, 0);
        options = undefined;
    }

    /*
     * extsprintf (which we invoke here with our caller's arguments in order
     * to construct this Error's message) is strict in its interpretation of
     * values to be processed by the "%s" specifier.  The value passed to
     * extsprintf must actually be a string or something convertible to a
     * String using .toString().  Passing other values (notably "null" and
     * "undefined") is considered a programmer error.  The assumption is
     * that if you actually want to print the string "null" or "undefined",
     * then that's easy to do that when you're calling extsprintf; on the
     * other hand, if you did NOT want that (i.e., there's actually a bug
     * where the program assumes some variable is non-null and tries to
     * print it, which might happen when constructing a packet or file in
     * some specific format), then it's better to stop immediately than
     * produce bogus output.
     *
     * However, sometimes the bug is only in the code calling VError, and a
     * programmer might prefer to have the error message contain "null" or
     * "undefined" rather than have the bug in the error path crash the
     * program (making the first bug harder to identify).  For that reason,
     * by default VError converts "null" or "undefined" arguments to their
     * string representations and passes those to extsprintf.  Programmers
     * desiring the strict behavior can use the SError class or pass the
     * "strict" option to the VError constructor.
     */
    if (!options || !options.strict) {
        args = args.map(function (a) {
            return (a === null ? 'null' :
                    a === undefined ? 'undefined' : a);
        });
    }

    tailmsg = args.length > 0 ?
        args.join('; ') : '';
    this.jse_shortmsg = tailmsg;
    this.jse_summary = tailmsg;

    if (options) {
        causedBy = options.cause;

        if (!causedBy || !(options.cause instanceof Error))
            causedBy = options;

        if (causedBy && (causedBy instanceof Error)) {
            this.jse_cause = causedBy;
            this.jse_summary += ': ' + causedBy.message;
        }
    }

    this.message = this.jse_summary;
    Error.call(this, this.jse_summary);

    if (Error.captureStackTrace) {
        ctor = options ? options.constructorOpt : undefined;
        ctor = ctor || arguments.callee;
        Error.captureStackTrace(this, ctor);
    }

    return (this);
}

VError.prototype = Error.prototype;
VError.prototype.name = 'Widget Error';

VError.prototype.toString = function ve_toString()
{
    var str = (this.hasOwnProperty('name') && this.name ||
        this.constructor.name || this.constructor.prototype.name);
    if (this.message)
        str += ': ' + this.message;

    return (str);
};

VError.prototype.cause = function ve_cause()
{
    return (this.jse_cause);
};

/**
 * Checks whether an error or one of its possible causes has a code provided.
 * @method
 * @param {Array|String} code(s) to look for.
 * @returns {Boolean} True if one of codes provided has been found, false otherwise.
 */
VError.prototype.hasCode = function ve_hasCode(code) {
    if (!code) return false;

    var codes = Object.prototype.toString.call(code) !== '[object Array]'
        ? [code] : code;

    if (codes.length === 0) return false;

    var error = this;
    var found = false;

    while(error) {
        if (error.code && codes.indexOf(error.code) > -1) {
             found = true;
            break;
        }

        error = error.cause();
    }

    return found;
};

module.exports = VError;

/* jshint ignore:end */


},{}],96:[function(require,module,exports){
/**
 * Widget Feature Augmenter
 * This module is an extension of the functionality in the <code>widget-instance-factory</code> for adding features
 * to widget instances.
 * @module core/widget-feature-augmenter
 * @exports {WidgetFeatureAugmenter} The constructor
 */

'use strict';

var WidgetError = require('./widget-error');

/**
 * Augments a widget object by initializing and adding a set of feature instances to its feature api
 * @constructor
 */
var WidgetFeatureAugmenter = function() {
};

/**
 * Adds a a list of features to the widget
 * @param {Object} widgetInstance The widget instance to add the features to
 * @param {Array} featureInstances a list of features to augment
 * @param {Object} widgetModel
 * @returns {Object} the widget instance modified
 */
WidgetFeatureAugmenter.prototype.addFeaturesToWidget = function(widgetInstance, featureInstances, widgetModel) {

    featureInstances = featureInstances || [];

    //features
    var featureMap = {};
    function findFeature(featureName, instances) {
        //match feature models to feature instances and initialize them with params
        for(var i = 0; i < instances.length; i++ ) {
            if(featureName === instances[i].name) {
                return instances[i];
            }
        }

        return null;
    }
    if(widgetModel.features && widgetModel.features.length) {
        for(var i = 0; i < widgetModel.features.length; i++) {
            var featureModel = widgetModel.features[i];
            var instance = findFeature(featureModel.name, featureInstances);
            if(instance) {
                //initialize the feature instance with the widget specific params
                if(typeof instance._init === 'function') {
                    instance._init(featureModel.params, widgetInstance, widgetModel); //memory ok here?
                }
                Object.defineProperty(featureMap, instance.name, {
                    enumerable: true,
                    value: instance
                });
            } else if(featureModel.required) {
                //throw an error the instance for a required feature is not available
                var m = 'Unable to render widget. A required feature is not available (' + featureModel.name + ')';
                throw new WidgetError(m);
            }
        }
    }
    Object.defineProperty(widgetInstance, 'features', {
        enumerable: false,
        value: featureMap
    });

    return widgetInstance;
};

module.exports = WidgetFeatureAugmenter;
},{"./widget-error":95}],97:[function(require,module,exports){
/**
 * Widget Instance Factory
 * @module core/widget-instance-factory
 */

'use strict';

var util = require('../util/util');

var STRING_PROPS = [
    'author',
    'version',
    'id',
    'authorEmail',
    'authorHref',
    'locale'
];

var LOCALIZABLE_STRING_PROPS = [
    'description',
    'name',
    'shortName'
];

/**
 * Creates widget instances
 * @constructor
 */
var  WidgetInstanceFactory = function() {
};

/**
 * Makes a widget instance
 * @param {Object} widgetModel The model to get the widget data from
 * @param {WidgetStorage} storage The storage strategy implementation to use for preferences
 * @param {WidgetRenderer} renderer A references to the renderer. Necessary for operations such as getting width/height
 * @param {string} locale A locale to use for i18n
 * @returns {Object} The widget instance
 */
WidgetInstanceFactory.prototype.makeWidget = function(widgetModel, storage, renderer, locale) {

    var widget = {};

    //define core string properties
    STRING_PROPS.forEach(function (propName) {
        Object.defineProperty(widget, propName, {
            enumerable: true,
            value: typeof widgetModel[propName] !== 'undefined' ? widgetModel[propName] : ''
        });
    });

    //define localizable string properties
    LOCALIZABLE_STRING_PROPS.forEach(function (propName) {

        var value = null;

        //try to find on the localized widget model
        if(locale && widgetModel._lang) {
            //find localized widget model
            var possibleLocales = util.getDescendantLocales(locale);
            var localizedWidgetModels = possibleLocales.map(function(possibleLocale) {
                return widgetModel._lang[possibleLocale];
            });
            var getValueFromLocalizedWidgetModels = function(localizedWidgetModels) {
                var value;
                if(localizedWidgetModels.length) {
                    var model = localizedWidgetModels.pop();
                    if(model) {
                        value = model[propName];
                    }
                    if(typeof value !== 'string') {
                        return getValueFromLocalizedWidgetModels(localizedWidgetModels);
                    }
                }
                return value;
            };
            value = getValueFromLocalizedWidgetModels(localizedWidgetModels);
        }
        //try to find default value if the localized model did not contain a valid value
        if(typeof value !== 'string' && typeof widgetModel[propName] === 'string') {
            value = widgetModel[propName];
        }
        //if there is no default value, try to match to the default locale
        else if(typeof value !== 'string' && widgetModel.defaultlocale) {
            var defaultLocalizedWidgetModel = widgetModel._lang[widgetModel.defaultlocale];
            if(defaultLocalizedWidgetModel) {
                value = defaultLocalizedWidgetModel[propName];
            }
        }

        Object.defineProperty(widget, propName, {
            enumerable: true,
            value: typeof value === 'string' ? value : ''
        });
    });

    //width and height
    Object.defineProperty(widget, 'width', {
        enumerable: true,
        get: function() {
            return renderer.getWidth();
        }
    });
    Object.defineProperty(widget, 'height', {
        enumerable: true,
        get: function() {
            return renderer.getHeight();
        }
    });

    //preferences
    Object.defineProperty(widget, 'preferences', {
        enumerable: false,
        value: storage
    });

    return widget;
};

module.exports = WidgetInstanceFactory;

},{"../util/util":123}],98:[function(require,module,exports){
/* jshint unused: vars */

/**
 * Tne Widget Engine
 * @module core/widget-renderer
 * @exports {WidgetRenderer} The constructor
 */

'use strict';

var util = require('../util/util');

/**
 * Renders a widget
 * @interface
 * @constructor
 * @param {Object} opts
 * @param {String} [opts.useFolderLocalization] Explicitly instructs the renderer to attempt to use folder
 *                                            localization. i.e. To look for the start file in
 *                                            /widgetPath/[locale]/index.html
 */
var WidgetRenderer = function(opts) {
};

/**
 * Starts the rendering process
 * @param {String} path The widget path
 * @param {Object} widgetModel
 * @param {Object} widgetInstance
 */
WidgetRenderer.prototype.render = function(path, widgetModel, widgetInstance) {

    throw new Error('WidgetRenderer#render must be overridden.');
};

/**
 * Returns the width of the widget
 */
WidgetRenderer.prototype.getWidth = function() {

    throw new Error('WidgetRenderer#getWidth must be overridden.');
};

/**
 * Returns the height of the widget
 */
WidgetRenderer.prototype.getHeight = function() {

    throw new Error('WidgetRenderer#getHeight must be overridden.');
};

/**
 * Returns the (typically) DOM node where the widget is rendered
 */
WidgetRenderer.prototype.getWidgetNode = function() {

    throw new Error('WidgetRenderer#getWidgetNode must be overridden.');
};

/**
 * Return the (typically) parent node of the where the widget was rendered
 */
WidgetRenderer.prototype.getParentNode = function() {
    throw new Error('WidgetRenderer#getContainerNode must be overridden.');
};

/**
 * Sets the parent node
 */
WidgetRenderer.prototype.setParentNode = function() {
    throw new Error('WidgetRenderer#setContainerNode must be overridden.');
};

/**
 * Returns a map of area nodes, which map area keys to dom nodes. Used by widgets that have children (containers)
 */
WidgetRenderer.prototype.getAreaNodes = function() {

    if(this.isContainer) {
        throw new Error('WidgetRenderer#getAreaNodes must be overridden.');
    }
};

/**
 * Cleans up dom elements created during the rendering process
 * (link tags, script tags, widget dom element)
 */
WidgetRenderer.prototype.destroy = function () {
    throw new Error('WidgetRenderer#destroy must be overriden.');
};

/**
 * Gets the widget mime type
 * @returns {string}
 */
WidgetRenderer.prototype.getType = function() {

	//default type for renderers
	return 'text/html';
};

/**
 * Returns a stack of start files. Renderers should first attempt to render the top start file in the stack
 * and pop on each failure until a successful start file is found
 * @param widgetPath
 * @param widgetModel
 * @returns {Array}
 */
WidgetRenderer.prototype.getStartFilePaths = function(widgetPath, widgetModel) {

	var startFiles = [];
	var startFile;

	if(widgetModel.content && widgetModel.content.src) {
		startFile = makeFullPath(widgetPath, widgetModel.content.src);
		startFiles.push(startFile);
	} else {
		//default root starfile
		startFile = makeFullPath(widgetPath, 'index.html');
		startFiles.push(startFile);

		//TODO: determine all locale options. (e.g. en-us is /locales/en/index.html + /locales/en-us/index.html)
		if(this.locale) {
			startFile = makeFullPath(widgetPath, 'locales/' + this.locale + '/index.html');
			startFiles.push(startFile);
		}
	}
	return startFiles;
};

function makeFullPath(widgetPath, startFile) {

    if(util.isUrlAbsolute(startFile) || (util.isUrlSiteRelative(widgetPath) && util.isUrlSiteRelative(startFile))) {
        return startFile;
    } else {
        var joinWithSlash = !util.endsWith(widgetPath, '/') && !util.startsWith(startFile, '/');
        return joinWithSlash ? widgetPath + '/' + startFile : widgetPath + startFile;
    }
}

module.exports = WidgetRenderer;

},{"../util/util":123}],99:[function(require,module,exports){
/* jshint unused: vars */

/**
 * Widget Storage. This is an implementation of <a href="http://www.w3.org/TR/webstorage/">W3C Web Storage</a>
 * @module core/widget-storage
 * @exports {WidgetStorage} The widget storage constructor
 */

'use strict';

/**
 * Widget decorator for web storage
 * @param storage A web storage implementation. e.g. sessionStorage
 * @constructor
 * @interface
 */
function WidgetStorage(storage) {}

/**
 * Initializes the storage
 * @method
 * @param {string} widgetInstanceId The widget id. Typically used as a key prefix in the underlying impl
 * @param {Array} preferences An array of preferences objects to initialize the storage with
 */
WidgetStorage.prototype.init = function(widgetInstanceId, preferences) {
    throw new Error('WidgetStorage#init must be overridden.');
};

/**
 * Gets an item
 * @param {string} key of the item to get
 */
WidgetStorage.prototype.getItem = function(key) {
    throw new Error('WidgetStorage#getItem must be overridden.');
};

/**
 * Sets or updates an item
 * @param {string} key
 * @param {string} value
 * @param {boolean} readonly
 */
WidgetStorage.prototype.setItem = function(key, value, readonly) {
    throw new Error('WidgetStorage#setItem must be overridden.');
};

/**
 * Removes the item from storage
 * @param {string} key
 */
WidgetStorage.prototype.removeItem = function(key) {
    throw new Error('WidgetStorage#removeItem must be overridden.');
};

/**
 * Clears the storage
 * @param {string} key
 */
WidgetStorage.prototype.clear = function(key) {
    throw new Error('WidgetStorage#removeItem must be overridden.');
};

/**
 * Returns a list of the keys used by this storage
 * @returns {Array} a list of keys
 */
WidgetStorage.prototype.key = function(n) {
    throw new Error('WidgetStorage#key must be overridden.');
};

/**
 * Export the constructor
 * @type {WidgetStorage}
 */
module.exports = WidgetStorage;
},{}],100:[function(require,module,exports){
'use strict';

var WidgetEngine = require('../core/widget-engine');

var ConfigParser = require('../strategies/parser/js-object-parser');
var Html5SeamlessRenderer = require('../strategies/renderer/html5-seamless-renderer');
var Html5ContainerRenderer = require('../strategies/renderer/html5-container-renderer');
var Html5LocalStorage = require('../strategies/storage/html5-local-storage');
var CxpAdditionsPlugin = require ('../plugins/cxp-additions-plugin');
var HandlebarsPreprocessor = require('../strategies/renderer/preprocessors/handlebars-preprocessor');
var SoyPreprocessor = require('../strategies/renderer/preprocessors/soy-preprocessor');

var loggerFactory = require('../util/logger-factory');

//using a function to get a single instance ensures that the preprocessor isn't instantiated too early, doing so
//might have caused problems with it getting the correct logger instance
var handlebarsPreprocessor = null;
var getHandlebarsInstance = function(configVars) {
    return handlebarsPreprocessor || (handlebarsPreprocessor = new HandlebarsPreprocessor(configVars));
};

var soyPreprocessor = null;
var getSoyInstance = function(configVars) {
    return soyPreprocessor || (soyPreprocessor = new SoyPreprocessor(configVars));
};


var Html5ContainerEngine = function(opts) {

    //logging
    //creates a bunyan logger
    //This will create a static instance of a logger that subsequent calls to loggerFactory.getLogger() will retrieve
    loggerFactory.createLogger({
        parentLog: opts.log,
        loggerName: 'container',
        logLevel: opts.logLevel,
        appendId: true
    });
};

Html5ContainerEngine.prototype.init = function(opts) {

    var widgetPath = opts.widgetUrl;
    var widgetEl = opts.widgetEl;
    var locale = opts.locale || null;
    var useFolderLocalization = opts.useFolderLocalization || false;
    var reader = opts.reader || null;
    var parser = opts.parser || new ConfigParser();
    var configVars = opts.configVars || {};

    var renderer = opts.renderer || new Html5ContainerRenderer(widgetEl, {
        locale: locale,
        configVars: configVars,
        useFolderLocalization: useFolderLocalization
    });

    var handlebarsPreprocessor = getHandlebarsInstance(configVars);
    renderer.addPreprocessor('text/x-handlebars-template', handlebarsPreprocessor);
    renderer.addPreprocessor('application/x-handlebars-template', handlebarsPreprocessor);

    var soyPreprocessor = getSoyInstance(configVars);
    renderer.addPreprocessor('application/x-soy', soyPreprocessor);

    var storage = opts.storage || new Html5LocalStorage();

    this.widgetEngine = new WidgetEngine({
        configFile: opts.configFile,
        widgetPath: widgetPath,
        locale: opts.locale,
        initialModel: opts.initialModel,
        renderer: renderer,
        parser: parser,
        reader: reader,
        storage: storage
    });

    this.widgetEngine.addPlugin(new CxpAdditionsPlugin({
        path: widgetPath,
        locale: opts.locale
    }));
};
Html5ContainerEngine.prototype.start = function() {

    return this.widgetEngine.start();
};
Html5ContainerEngine.prototype.addPlugin = function(plugin) {

    this.widgetEngine.addPlugin(plugin);
    return this;
};
Html5ContainerEngine.prototype.addFeature = function(feature) {

    this.widgetEngine.addFeature(feature);
    return this;
};
Html5ContainerEngine.prototype.getLogger = function() {

    return this.log;
};
Html5ContainerEngine.prototype.destroy = function () {
    return this.widgetEngine.destroy();
};

var Html5WidgetEngine = function(opts) {

    //This will create a static instance of a logger that subsequent calls to loggerFactory.getLogger() will retrieve
    loggerFactory.createLogger({
        parentLog: opts.log,
        loggerName: 'widget',
        logLevel: opts.logLevel,
        appendId: true
    });
};

Html5WidgetEngine.prototype.init = function(opts) {

    var widgetPath = opts.widgetUrl;
    var widgetEl = opts.widgetEl;
    var locale = opts.locale || null;
    var useFolderLocalization = opts.useFolderLocalization || false;
    var reader = opts.reader || null;
    var parser = opts.parser || new ConfigParser();
    var configVars = opts.configVars || {};

    var renderer = opts.renderer ||  new Html5SeamlessRenderer(widgetEl, {
        locale: locale,
        configVars: configVars,
        useFolderLocalization: useFolderLocalization
    });

    var handlebarsPreprocessor = getHandlebarsInstance(configVars);
    renderer.addPreprocessor('text/x-handlebars-template', handlebarsPreprocessor);
    renderer.addPreprocessor('application/x-handlebars-template', handlebarsPreprocessor);

    var soyPreprocessor = getSoyInstance(configVars);
    renderer.addPreprocessor('application/x-soy', soyPreprocessor);

    var storage = opts.storage || new Html5LocalStorage();

    this.widgetEngine = new WidgetEngine({
        configFile: opts.configFile,
        widgetPath: widgetPath,
        parser: parser,
        reader: reader,
        renderer: renderer,
        storage: storage,
        locale: opts.locale,
        initialModel: opts.initialModel
    });
    this.widgetEngine.addPlugin(new CxpAdditionsPlugin({
        path: widgetPath,
        locale: opts.locale
    }));
};
Html5WidgetEngine.prototype.start = function() {

    return this.widgetEngine.start();
};
Html5WidgetEngine.prototype.addPlugin = function(plugin) {

    this.widgetEngine.addPlugin(plugin);
    return this;
};
Html5WidgetEngine.prototype.addFeature = function(feature) {

    this.widgetEngine.addFeature(feature);
    return this;
};
Html5WidgetEngine.prototype.getLogger = function() {

    return this.log;
};
Html5WidgetEngine.prototype.destroy = function () {
    return this.widgetEngine.destroy();
};

module.exports = {
    WidgetEngine: Html5WidgetEngine,
    ContainerEngine: Html5ContainerEngine
};

},{"../core/widget-engine":93,"../plugins/cxp-additions-plugin":108,"../strategies/parser/js-object-parser":110,"../strategies/renderer/html5-container-renderer":111,"../strategies/renderer/html5-seamless-renderer":112,"../strategies/renderer/preprocessors/handlebars-preprocessor":113,"../strategies/renderer/preprocessors/soy-preprocessor":114,"../strategies/storage/html5-local-storage":116,"../util/logger-factory":121}],101:[function(require,module,exports){
'use strict';

var loggerFactory   = require('../util/logger-factory');
var ExtPromise      = require('promise-extensions')();
var widgetHandlers  = require('./backbase-format/widget-handlers');
var legacyWidgetApi = require('./backbase-format/legacy-widget-api');
var IncludeObject   = require('./backbase-format/include-object');

var convertToArray  = Array.prototype.slice.call.bind(Array.prototype.slice);

module.exports = BackbaseFormatPlugin;

function BackbaseFormatPlugin(opts) {

    opts = opts || {};
    this.opts = opts;

    this.name = 'Backbase Format';
    this.portalConf = opts.portalConf || {};
    this.contextRoot = opts.contextRoot || '';
    this.remoteContextRoot = opts.remoteContextRoot || '';
    this.csrfToken = opts.csrfToken || null;
    this.makeIncludedRefsAbsolute = opts.makeIncludedRefsAbsolute || false;
    this.window = typeof window === 'undefined' ? opts.window : window;
    this.log = loggerFactory.getLogger();
    this.opts.log = this.log;
}

/**
 * Fix paths in the model
 * @param widgetModel
 */
BackbaseFormatPlugin.prototype.postRead = function(widgetModel) {
    //use hints in the model to guess if its a soy template
    if(hasPreference('viewNamespace') && widgetModel.content.config && !widgetModel.content.src) {
        widgetModel.content.type = 'application/x-soy';
        widgetModel.content.src = widgetModel.content.config;
    }

    function hasPreference(name) {
        return widgetModel.preferences.some(function(pref) {
            return pref.name === name;
        });
    }

    return widgetModel;
};

/**
 * Makes the widgetInstance backwards compatible with the Backbase Format
 * @param widgetInstance
 * @param renderer
 * @param widgetModel
 * @return Returns the enhanced widget instance
 */
BackbaseFormatPlugin.prototype.preRender = function(widgetInstance, renderer, widgetModel) {

    this.log.info('Backbase format plugin is running in PRE RENDER phase...');

    if(!widgetInstance.preferences.getItem('src')) {
        widgetInstance.preferences.defineItem({
            name: 'src',
            value: widgetModel.content.src,
            readonly: false
        });
    }
    if(!widgetInstance.preferences.getItem('thumbnailUrl')) {
        widgetInstance.preferences.defineItem({
            name: 'thumbnailUrl',
            value: widgetModel.icons[0],
            readonly: false
        });
    }

    //special case for legacy portal 5 preferences
    if(!widgetInstance.preferences.getItem('title')) {
        widgetInstance.preferences.defineItem({
            name: 'title',
            value: widgetModel.title,
            readonly: false
        });
    }

    var bbWidgetInstance = legacyWidgetApi.buildWidget(widgetInstance, widgetModel, this.log, this.portalConf.tags);

    //need to update the preferences' event target if it has already been set to the widget instance that was cloned
    var index = bbWidgetInstance.preferences.eventTarget ?
        bbWidgetInstance.preferences.eventTarget.indexOf(widgetInstance) : -1;
    if(index > -1) {
        bbWidgetInstance.preferences.eventTarget[index] = bbWidgetInstance;
    }

    this.log.info('Backbase format plugin PRE RENDER done.');

    return bbWidgetInstance;
};

/**
 * Parses special markup such as g:onload
 * @param widgetInstance
 * @param renderer
 * @param widgetModel
 */
BackbaseFormatPlugin.prototype.postRender = function(widgetInstance, renderer, widgetModel) {
    var self = this;
    var log = this.log;
    var window = this.window;
    var chain;

    log.info('Backbase format plugin is running in POST RENDER phase...');

    legacyWidgetApi.applyPresentationApi(widgetInstance, renderer, widgetModel, log);

    //g:includes
    var includeElements = convertToArray(widgetInstance.body.getElementsByTagName('g:include'));
    var includes = includeElements.map(function (gInclude) {
        return new IncludeObject(gInclude, widgetInstance, widgetModel, self.opts);
    });

    if (includes.length) {
        // define include related API on a widget instance
        widgetInstance.includes = includes;
        widgetInstance.refreshIncludes = function refreshIncludes() {
            var resultPromises = this.includes.map(function (include) {
                return include.refresh();
            });

            return ExtPromise.settleAll(resultPromises).then(function (inspections) {
                var errorCount = inspections.filter(function(includePromiseInspection) {
                    return includePromiseInspection.isRejected();
                }).length;
                if(errorCount > 0) {
                    log.warn('%s includes failed to resolve.', errorCount);
                }
            });
        };

        // replace g:include element with corresponding content holder node an include object has
        includes.forEach(function (include, i) {
            var gElement = includeElements[i];
            gElement.parentNode.replaceChild(include.htmlNode, gElement);
        });

        chain = widgetInstance.refreshIncludes();
    } else {
        chain = ExtPromise.resolve();
    }

    return chain.then(function () {
        //do handlers
        var chromeNode = findChromeNode(widgetInstance.body) || widgetInstance.body;
        widgetHandlers.handleLoad(window, widgetInstance, log);
        widgetHandlers.handlePrefModified(window, widgetInstance, log);
        widgetHandlers.handleMaximize(window, widgetInstance, chromeNode, log);
        widgetHandlers.handleRestore(window, widgetInstance, chromeNode, log);

        log.info('Backbase format plugin POST RENDER done.');

        return widgetInstance;
    });
};


function findChromeNode (element) {
    var parent = element;

    while (parent) {
        if (typeof parent.hasAttribute === 'function' && parent.hasAttribute('data-chrome')) {
            return parent;
        }
        parent = parent.parentNode;
    }
    
    return null;
}

},{"../util/logger-factory":121,"./backbase-format/include-object":103,"./backbase-format/legacy-widget-api":105,"./backbase-format/widget-handlers":107,"promise-extensions":87}],102:[function(require,module,exports){
'use strict';

var util    = require('../../util/util');
var url     = require('url');

var convertToArray = Array.prototype.slice.call.bind(Array.prototype.slice);

module.exports = {
    getStartFileFolder      : getStartFileFolder,
    makeReferenceAbsolute   : makeRefAbsolute,
    resolveExpression       : resolveExpression,
    isEmpty                 : isEmpty,
    convertToArray          : convertToArray
};

function getStartFileFolder (startFile, contextRoot) {

    //strip file from widget src to get path
    var widgetPath = startFile.replace(/\/[^\/]+$/, '');
    //also replace context root placeholder
    widgetPath = widgetPath.replace(/\$\(contextRoot\)/, contextRoot);

    var startFilePath = util.isUrlAbsolute(startFile) ? startFile : widgetPath + '/' + startFile;

    return startFilePath.substring(0, startFilePath.lastIndexOf('/') + 1);
}

function makeRefAbsolute(html, remoteContextRoot) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var imgs = convertToArray(doc.getElementsByTagName('img'));

    imgs.forEach(function(img) {
        var src = img.getAttribute('src');
        if(src && util.isUrlSiteRelative(src)) {
            img.setAttribute('src', mergeUrls(remoteContextRoot, src));
        }
    });

    return doc.body.innerHTML;
}

function mergeUrls(first, second) {
    var i, currentMatch;
    for(i = 1; i < Math.min(first.length, second.length); i++) {
        currentMatch = first.substr(-1 * i, i);
        if(second.indexOf(currentMatch) === 0) {
            break;
        }
    }

    var baseUrl = currentMatch ? first.substr(0, first.length - currentMatch.length) : first;

    return url.resolve(baseUrl, second);
}

function resolveExpression(expression, context) {
    var parts = expression.split('.');

    function doNextPart(parts, val) {
        val = val[parts.shift()];
        if(parts.length > 0 && val && typeof val === 'object') {
            return doNextPart(parts, val);
        } else {
            return val;
        }
    }

    return doNextPart(parts, context);
}

function isEmpty(value) {
    return value === undefined || value === null || value === '';
}

},{"../../util/util":123,"url":131}],103:[function(require,module,exports){
(function (global){
/* globals Promise: false */
'use strict';

var util                = require('../../util/util');
var bunyan              = require('browser-bunyan');
var helpers             = require('./include-helpers');
var ParameterBuilder    = require('./include-param-builder');

var fetch       = global.fetch;
var FormData    = global.FormData; // jshint ignore:line

module.exports = IncludeObject;

/**
 * Represents g:include element as an object with defined API
 * @param gIncludeNode
 * @param widget
 * @param widgetModel
 * @param opts
 * @constructor
 */
function IncludeObject(gIncludeNode, widget, widgetModel, opts) {
    opts = opts || {};

    var remoteContextRoot = opts.remoteContextRoot || '';
    var contextRoot = opts.contextRoot || '';
    var config = {
        replaceRegex: /\$\{([a-zA-Z0-9-_]+)\}/,
        log: opts.log,
        startFileFolder: helpers.getStartFileFolder(widgetModel.content.src, contextRoot),
        remoteContextRoot: remoteContextRoot,
        //if a remote context root is defined use it. Fall back to regular context root.
        contextRoot: remoteContextRoot || contextRoot,
        csrfToken: opts.csrfToken,
        makeIncludedRefsAbsolute: opts.makeIncludedRefsAbsolute
    };

    Object.defineProperty(this, '_config', {
        value: config
    });

    this.widget = widget;
    this.uri = {
        template: gIncludeNode.getAttribute('src')
    };
    this.proxy = gIncludeNode.getAttribute('proxy') === 'true';
    this.method = gIncludeNode.getAttribute('method') || 'GET';

    var htmlNode = global.document.createElement('div');
    htmlNode.className = 'bp-g-include';

    this.htmlNode = htmlNode;

    var parameterBuilder = new ParameterBuilder(widgetModel, opts);
    this.params = parameterBuilder.buildParameters(this, gIncludeNode);
}

/**
 * Sets URI a include object should send requests to.
 * @param {String} uri
 */
IncludeObject.prototype.setURI = function setUri (uri) {
    if (uri && typeof uri === 'string') {
        this.uri.template = uri;
    }
};

/**
 * Returns resolved URI
 * @returns {*}
 */
IncludeObject.prototype.getContentURI = function getContentURI () {
    var src = this.uri.template;
    if (!src) {
        return '';
    }

    var config = this._config;
    var self = this;

    src = src.replace(config.replaceRegex, function (match, p1) {
        return self.widget.getPreference(p1);
    });

    src = src.replace('$(contextRoot)', config.contextRoot);
    if (util.isUrlDocumentRelative(src)) {
        console.log('=========== ', config.startFileFolder);
        src = config.startFileFolder + src;
        config.log.debug('g:include src after resolution is [%s]', src);
    }

    return src;
};

/**
 * Generates a request to a remote service and renders returned contents.
 * @returns {Promise} promise is resolved with html node that corresponds to this object
 */
IncludeObject.prototype.refresh = function refresh () {
    var config = this._config;
    var log = config.log;

    var requestParams = this._getRequestParams();
    var requestUrl = this._resolveRequestUrl(requestParams);
    var requestOptions = this._getRequestOptions(requestParams);

    // send request then append received HTML to htmlNode
    if(log.level() <= bunyan.DEBUG) {
        var fetchOptsJson = JSON.stringify(requestOptions, null, '\t');
        log.debug('Making g:include http request to [%s] with fetch opts: [%s]', requestUrl, fetchOptsJson);
    }

    return fetch(requestUrl, requestOptions).then(function(res) {
        log.debug('g:include request to [%s] completed with status: %s', requestUrl, res.status);
        return res.status >= 200 && res.status < 300 ?
            Promise.resolve(res.text()) : Promise.reject(res.statusText);
    }).catch(function(statusText) {
        return 'Unable to resolve g:include ( ' + statusText + ' )';
    }).then(function(html) {
        log.trace('Received html response:\n%s', html);
        if(config.makeIncludedRefsAbsolute && config.remoteContextRoot) {
            html = helpers.makeReferenceAbsolute(html, config.remoteContextRoot);
        }
        this.htmlNode.innerHTML = html;
        this.htmlNode.setAttribute('data-src', requestUrl);

        return this.htmlNode;
    }.bind(this));
};

IncludeObject.prototype._getRequestParams = function getRequestParams () {
    var requestParams = [];

    if (this.proxy) {
        requestParams = this.params.filter(function (param) {
            return param.destination === 'proxy';
        });

        var contentUri = this.getContentURI();
        if (contentUri) {
            var targetQueryParamsString = this.params.filter(function (param) {
                return param.destination === 'target';
            }).map(function (param) {
                return param.toQueryString();
            }).filter(function (qStr) {
                return !!qStr;
            }).join('&');

            // create special 'url' parameter
            var urlParam = {
                name: 'url',
                getQueryParams: function() {
                    return [{
                        name: this.name,
                        value: contentUri + (contentUri.indexOf('?') !== -1 ? '&' : '?') + targetQueryParamsString
                    }];
                },
                toQueryString: function() {
                    var param = this.getQueryParams()[0];
                    return param.name + '=' + encodeURIComponent(param.value);
                }
            };

            requestParams.push(urlParam);
        }
    } else {
        requestParams = this.params.filter(function (param) {
            return param.destination === 'target';
        });
    }

    return requestParams;
};

IncludeObject.prototype._resolveRequestUrl = function resolveRequestUrl(requestParams) {
    var url = this.proxy ? this._config.remoteContextRoot + '/proxy' : this.getContentURI();

    if (this.method && this.method.toUpperCase() !== 'POST') {
        var queryStr = requestParams.map(function (param) {
            return param.toQueryString();
        }).join('&');
        url += (url.indexOf('?') >= 0 ? '&' : '?') + queryStr;
    }

    return url;
};

IncludeObject.prototype._getRequestOptions = function(requestParams) {
    var config = this._config;
    var options = {
        credentials: 'same-origin'
    };

    if (this.method && this.method.toUpperCase() === 'POST') {
        options.method = this.method;
        options.headers = {};
        options.body = this._constructFormData(requestParams);

        // CSRF token
        var csrfToken = config.csrfToken;
        if (csrfToken) {
            options.headers[csrfToken.name] = csrfToken.value;
        }
    }

    return options;
};

IncludeObject.prototype._constructFormData = function constructFormData(params) {
    var formData = new FormData();

    params.reduce(function (acc, param) {
        return acc.concat(param.getQueryParams());
    }, []).forEach(function (queryParam) {
        formData.append(queryParam.name, queryParam.value);
    });

    return formData;
};

// obsolete methods
['getContentIterator', 'hasContent', 'setContent'].forEach(function (method) {
    IncludeObject.prototype[method] = function() {
        this._config.log.warn('%s method is no longer supported in CXP6', method);
    };
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../util/util":123,"./include-helpers":102,"./include-param-builder":104,"browser-bunyan":1}],104:[function(require,module,exports){
'use strict';

var helpers = require('./include-helpers');

module.exports = IncludeParameterBuilder;

/**
 * Builds g:include parameter objects.
 * @param {Object} widgetModel widget model
 * @param {Object} opts options
 * @constructor
 */
function IncludeParameterBuilder(widgetModel, opts) {
    this._widgetModel = widgetModel;
    this._log = opts.log;
    this._remoteContextRoot = opts.remoteContextRoot || '';
    this._contextRoot = opts.contextRoot || '';

    // factory method map
    this._paramFactoryMap = {
        'g:http-param': this._buildHttpParam,
        'g:http-proxy-param': this._buildHttpProxyParam,
        'g:http-preference-param': this._buildPreferenceParam,
        'g:http-preference-param-map': this._buildPreferenceParamMap
    };
}

/**
 * Parses parameters found in g:include element and creates corresponding objects
 * @param {Object} includeObject include object created parameters belong to
 * @param {DOMElement} gIncludeNode g:include element
 * @returns {Array}
 */
IncludeParameterBuilder.prototype.buildParameters = function buildParameters(includeObject, gIncludeNode) {
    var self = this;
    // retain order of parameters
    var params = this._flattenElementTree(gIncludeNode).filter(function (node) {
        var nodeName = node.nodeName.toLowerCase();
        return (nodeName in self._paramFactoryMap);
    }).map(function (paramTag) {
        var nodeName = paramTag.nodeName.toLowerCase();
        var parseFunc = self._paramFactoryMap[nodeName];

        return parseFunc.call(self, paramTag, includeObject);
    }).filter(function (param) {
        return !!param;
    });

    // obsolete methods definition
    params.forEach(function (param) {
        ['getName', 'getValues'].forEach(function (method) {
            param[method] = function() {
                this._log.warn('%s method is no longer supported in CXP6', method);
            };
        });
    });

    return params;
};

/**
 * Converts tree of elements into a flat list of elements. Elements in a list are in document order.
 * @param rootElement
 * @returns {Array}
 * @private
 */
IncludeParameterBuilder.prototype._flattenElementTree = function flattenElementTree(rootElement) {
    var flatList = [];
    var currentNode = rootElement.firstChild;

    while (currentNode) {
        if (currentNode.nodeType === 1) { // element
            flatList.push(currentNode);
        }

        currentNode = currentNode.hasChildNodes() ? currentNode.firstChild : currentNode.nextSibling;
    }

    return flatList;
};

/**
 * Builds parameter object from g:http-param element
 * @param paramTag
 * @param includeObj
 * @param isProxy
 * @returns {Object}
 * @private
 */
IncludeParameterBuilder.prototype._buildHttpParam = function buildHttpParam(paramTag, includeObj, isProxy) {
    var contextRoot = this._remoteContextRoot || this._contextRoot;

    var param = new HttpParameter(paramTag, includeObj, this._log, isProxy, contextRoot);
    return param.value.template ? param : null;
};

/**
 * Builds parameter object flom g:http-proxy-param element
 * @param paramTag
 * @param includeObj
 * @returns {Object}
 * @private
 */
IncludeParameterBuilder.prototype._buildHttpProxyParam = function buildHttpProxyParam(paramTag, includeObj) {
    return this._buildHttpParam(paramTag, includeObj, true);
};

/**
 * Builds parameter object from g:http-preference-param element
 * @param paramTag
 * @param includeObj
 * @returns {Object}
 * @private
 */
IncludeParameterBuilder.prototype._buildPreferenceParam = function buildPreferenceParam(paramTag, includeObj) {
    var param = new PreferenceParameter(paramTag, includeObj, this._log);
    return param.name.template ? param : null;
};

/**
 * Builds parameter object from g:http-preference-param-map element
 * @param paramTag
 * @param includeObj
 * @returns {Object}
 * @private
 */
IncludeParameterBuilder.prototype._buildPreferenceParamMap = function buildPrefParamMap(paramTag, includeObj) {
    var param = new PreferenceMapParameter(paramTag, includeObj, this._log, this._widgetModel);
    return param._typeName ? param : null;
};


/**
 * Base parameter object
 * @param paramTag
 * @param includeObject
 * @param log
 * @param destination
 * @constructor
 */
function IncludeParameter(paramTag, includeObject, log, destination) {
    this.name = {
        template: paramTag.getAttribute('name')
    };
    this.value = {
        template: paramTag.getAttribute('value')
    };
    this.destination = destination || 'target';
    this.method = (paramTag.getAttribute('method') || includeObject.method || 'GET').toUpperCase();

    // read-only "internal" properties
    Object.defineProperty(this, '_include', {value: includeObject});
    Object.defineProperty(this, '_log', {value: log});
}


IncludeParameter.prototype.getQueryParams = function toQueryString() {
    return [];
};

IncludeParameter.prototype.toQueryString = function toQueryString() {
    return this.getQueryParams().map(function (param) {
        return param.name + '=' + encodeURIComponent(param.value);
    }).join('&');
};


/**
 * Represents g:http-preference-param-map parameter
 * @param paramTag
 * @param includeObject
 * @param log
 * @param widgetModel
 * @constructor
 */
function PreferenceMapParameter(paramTag, includeObject, log, widgetModel) {
    IncludeParameter.call(this, paramTag, includeObject, log);

    var dataType = paramTag.getAttribute('dataType') || paramTag.getAttribute('datatype');
    // type is used to build query param name
    Object.defineProperty(this, '_typeName',  {
        value: dataType
    });

    var prefs = widgetModel.preferences || [];
    // remember name of preferences with the same type
    Object.defineProperty(this, '_prefs',  {
        value: prefs.filter(function (pref) {
            return pref.type === dataType;
        }).map(function(pref) {
            return pref.name;
        })
    });
}

PreferenceMapParameter.prototype = Object.create(IncludeParameter.prototype);

PreferenceMapParameter.prototype.getQueryParams = function() {
    var namespace = this._typeName;
    var self = this;

    return this._prefs.map(function (prefName) {
        return {
            name: namespace + '.' + prefName,
            value: self._include.widget.getPreference(prefName)
        };
    });
};

/**
 * Represents g:http-preference-param parameter
 * @param paramTag
 * @param includeObject
 * @param log
 * @constructor
 */
function PreferenceParameter(paramTag, includeObject, log) {
    IncludeParameter.call(this, paramTag, includeObject, log);
}

PreferenceParameter.prototype = Object.create(IncludeParameter.prototype);

PreferenceParameter.prototype.getQueryParams = function() {
    var name = this.name ? this.name.template : null;
    if (helpers.isEmpty(name)) {
        return [];
    }

    var value = this._include.widget.getPreference(name);
    if (helpers.isEmpty(value)) {
        this._log.warn('Failed to resolve g:include parameter value. Parameter - [%s]', name);
    }

    return [{
        name: name,
        value: value
    }];
};

/**
 * Represents g:http-param & g:http-proxy-param parameters
 * @param paramTag
 * @param includeObject
 * @param log
 * @param isProxy
 * @param contextRoot
 * @constructor
 */
function HttpParameter(paramTag, includeObject, log, isProxy, contextRoot) {
    var destination = isProxy ? 'proxy' : 'target';
    IncludeParameter.call(this, paramTag, includeObject, log, destination);

    // read-only "internal" properties
    Object.defineProperty(this, '_replaceRegex', {value: /\$\{([a-zA-Z0-9-_]+)\}/});
    Object.defineProperty(this, '_contextRoot', {value: contextRoot});
}

HttpParameter.prototype = Object.create(IncludeParameter.prototype);

HttpParameter.prototype.getQueryParams = function() {
    var name = this.name ? this.name.template : null;
    var value = this.value ? this.value.template : null;
    var origValue = value;
    var widget = this._include.widget;
    var contextRoot = this._contextRoot;

    if (helpers.isEmpty(name) || helpers.isEmpty(value)) {
        return [];
    }

    // resolve value
    value = value.replace(this._replaceRegex, function (match, p1) {
        //special case for contextRoot: ${contextRoot}
        if (p1 === 'contextRoot') {
            return contextRoot;
        } else {
            return widget.getPreference(p1);
        }
    });

    if (value.indexOf('__WIDGET__') === 0) {
        var expression = value.split('.').filter(function(it, i) {
            return i !== 0;
        }).join('.');

        value = helpers.resolveExpression(expression, widget);

        if (helpers.isEmpty(value)) {
            this._log.warn('Failed to resolve g:include parameter value. Parameter - [%s], unresolved value - [%s], ' +
                'resolved value - [%s]',
                name, origValue, value);
        }
    }

    return [{
        name: name,
        value: value
    }];
};

},{"./include-helpers":102}],105:[function(require,module,exports){
(function (process,global){
'use strict';

var util                    = require('../../util/util');
var EventTarget             = require('event-target');
var warnDeprecatedAccess    = require('./warn-deprecated-access');
var StorageEvent            = require('../../strategies/storage/storage-event');

function buildWidget(widget, widgetModel, log, tags) {
    var WIDGET_TYPE = 'backbaseWidget';

    // need to clone the widget because we can't change readonly properties
    var bbWidgetInstance = util.cloneDeep(widget);

    bbWidgetInstance.width          = widget.width;
    bbWidgetInstance.height         = widget.height;
    bbWidgetInstance.preferences    = widget.preferences;
    bbWidgetInstance.features       = widget.features;
    bbWidgetInstance.id             = widgetModel.id || Math.random().toString(36).substr(2, 5);
    bbWidgetInstance.name           = widgetModel.name;
    bbWidgetInstance.nodeType       = 1;
    bbWidgetInstance.nodeValue      = WIDGET_TYPE;
    bbWidgetInstance.margins        = { top: 0, right: 0, bottom: 0, left: 0 };

    // definition
    bbWidgetInstance.myDefinition = {
        sUrl: widgetModel.content.src
    };

    // node & tag names
    bbWidgetInstance.nodeName = WIDGET_TYPE;
    bbWidgetInstance.tagName = WIDGET_TYPE;

    // tags
    bbWidgetInstance.tags = util.isArray(tags) ? tags : [];

    // MODEL
    bbWidgetInstance.model = createModel(bbWidgetInstance, widgetModel);

    // DEPRECATED FIELDS
    warnDeprecatedAccess(bbWidgetInstance, log);

    // FUNCTIONS
    setMethods(bbWidgetInstance);

    // EVENTS
    if(bbWidgetInstance.addEventListener && bbWidgetInstance.dispatchEvent) {
        bbWidgetInstance.addEventListener('storage', function (e) {
            log.debug('Chaining StorageEvent to Backbase \'PrefModified\' event...');

            var PREF_MODIFIED_EVENT = 'PrefModified';
            var chainedEvent = new StorageEvent(PREF_MODIFIED_EVENT);
            chainedEvent.initStorageEvent(PREF_MODIFIED_EVENT, false, false, e.key, e.oldValue, e.newValue, e.url,
                bbWidgetInstance.preferences);
            chainedEvent.attrName = e.key;
            chainedEvent.prevValue = e.oldValue;
            bbWidgetInstance.model.dispatchEvent(chainedEvent);
        });
    }

    return bbWidgetInstance;
}

function applyDomRelatedApi(widget, renderer, widgetModel, log) {
    var widgetNode = widget.body || renderer.getWidgetNode();
    var onloadAttr = widgetNode.getAttribute('g:onload');

    //only do this stuff if the widget is using a g:onload
    if(onloadAttr) {
        //wraps the widget in a 'widget body' element
        var body = global.document.createElement('div');
        var widgetParent  = widgetNode.parentNode;
        var widgetSibling = widgetNode.nextSibling;

        body.appendChild(widgetNode);
        body.className = 'bp-widget-body';

        if (widgetSibling) {
            widgetParent.insertBefore(body, widgetSibling);
        } else {
            widgetParent.appendChild(body);
        }

        //assigns the body to the inner body node required by backbase widgets.
        widget.body = body;
    }

    widget.htmlNode = findChromeNode(widgetNode);
    widget.refreshHtml = function () {
        var cxpFeature = this.features && this.features.cxp;
        if (cxpFeature) {
            cxpFeature.render.rerenderItem(widgetModel.id, widgetModel.name, widgetModel);
        } else {
            log.warn('A widget is required to have "CXP" feature in order to be able to refresh its view.');
        }
    };
}

function createModel(widget, widgetModel) {
    var model = {

        // general stuff
        jxid: 'VIEW-' + widgetModel.name,
        localName: 'Widget',
        name: widgetModel.name,
        tag: 'widget',
        tagName: 'Widget',

        //portal conf
        contextItemName:  widget.features && widget.features.cxp && widget.features.cxp.config ?
            widget.features.cxp.config.get('portalName') : null,
        extendedItemName: widgetModel.extendedItemName || null,
        parentItemName: widgetModel.parentItemName || null,
        securityProfile: widgetModel.securityProfile || null,
        uuid: widgetModel.id || null,

        //preferences
        preferences: makePreferences(widget.preferences),

        //tags
        tags: util.isArray(widgetModel.tags) ? widgetModel.tags : [],

        // methods
        addEventListener: EventTarget.addEventListener,
        removeEventListener: EventTarget.removeEventListener,
        dispatchEvent: EventTarget.dispatchEvent
    };

    model.save = function(callback) {
        var self = this;
        process.nextTick(function() {
            if(typeof callback === 'function') {
                var ctx = {
                    contextItemName:  self.contextItemName,
                    name: self.name,
                    preferences: self.preferences,
                    tag: self.tag
                };
                var mockXhr = {
                    status: 204,
                    statusText: 'No Content',
                    readyState: 4
                };
                callback.call(global, ctx, mockXhr);
            }

        });
    };

    model.getPreference = function(key) {
        return widget.preferences.getItem(key);
    };
    model.setPreference = function(key, value) {
        widget.preferences.setItem(key, value);
    };

    return model;
}

function setMethods(widget) {
    widget.getPreference = function (key) {
        return this.preferences.getItem(key);
    };

    widget.getPreferenceFromParents = widget.getPreference;
    widget.getAreaPreference = function () {
        return this.preferences.getItem('area') || 0;
    };

    widget.getOrderPreference = function () {
        return this.preferences.getItem('order');
    };

    widget.setPreference = function (key, value) {
        this.preferences.setItem(key, value);
    };

    widget.getDefinition = function () {
        return widget.myDefinition;
    };

    widget.setAreaPreference = function (area) {
        this.preferences.setItem('area', area);
    };

    widget.setOrderPreference = function (order) {
        this.preferences.setItem('order', order);
    };
}

function makePreferences(storage) {
    return storage._items;
}

function findChromeNode (element) {
    var parent = element;

    while (parent) {
        if (typeof parent.hasAttribute === 'function' && parent.hasAttribute('data-chrome')) {
            return parent;
        }
        parent = parent.parentNode;
    }

    return null;
}

module.exports = {
    buildWidget: buildWidget,
    applyPresentationApi: applyDomRelatedApi
};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../strategies/storage/storage-event":117,"../../util/util":123,"./warn-deprecated-access":106,"_process":126,"event-target":2}],106:[function(require,module,exports){
'use strict';

module.exports = warnDeprecatedPropertyAccess;

// Widget instance variables supported by PC5 but obselete in 6.0
// Access to these fields will print warning on the console
var unsupportedProperties = [
    'attributes', 'childNodes', 'cls_custom', 'cnBase', 'firstChild', 'flex', 'htmlArea',
    'htmlDoc', 'htmlFoot', 'htmlHead', 'lastChild', 'layout', 'local_listeners', 'localName',
    'namespaceURI', 'nextSibling', 'node', 'ownerDocument', 'parentNode', 'perspective',
    'prefix', 'previousSiblings'
];

// Widget instance methods supported by PC5 but obselete in 6.0
// Access to these methods will print warning on the console
var unsupportedMethods = [
    'appendChild', 'cloneNode', 'createDisplay', 'createPerspective', 'destroy',
    'disableDesignMode', 'dragIsTarget', 'enableDesignMode', 'getAreaOrderedChildren',
    'getAttribute', 'getAttributeNS', 'getClassID', 'getCurrentPerspective', 'getDisplay',
    'getDisplayEventTarget', 'getDisplayModel', 'getElementsByTagName', 'getElementsByTagNameNS',
    'getHTMLArea', 'hasAttribute', 'hasAttributeNS', 'hasAttributes', 'hasChildNodes',
    'hideDesignTools', 'hideDragTargets', 'insertBefore', 'insertDisplayChild', 'loadChildren',
    'lookupNamespaceURI', 'refreshIncludes', 'removeAttribute', 'removeAttributeNS', 'removeChild',
    'renderDisplay', 'replaceChild', 'setAttribute', 'setAttributeNS', 'setCurrentPerspective',
    'showDesignTools', 'showDragTargets', 'template'
];

function warnUnsupported (log, field, isMethod) {
    return function () {
        var message = 'COMPATIBILITY: %s is a widget %s that is no longer supported in CXP6';
        log.warn(message, field, isMethod ? 'method' : 'property');
    };
}

function warnDeprecatedPropertyAccess (widgetInstance, log) {
    var unsupportedPropertyDefinitions = unsupportedProperties.reduce(function (defs, field) {
        defs[field] = {
            enumerable: true,
            get: warnUnsupported(log, field),
            set: warnUnsupported(log, field)
        };

        return defs;
    }, {});

    Object.defineProperties(widgetInstance, unsupportedPropertyDefinitions);

    unsupportedMethods.reduce(function (instance, method) {
        instance[method] = warnUnsupported(log, method, true);
        return instance;
    }, widgetInstance);

    return widgetInstance;
}

},{}],107:[function(require,module,exports){
'use strict';

// see https://my.backbase.com/docs/product-documentation/documentation/portal/5.6.1/references_widgetnamespace.html#/list

module.exports = {
    handleLoad: handleLoad,
    handleMaximize: handleMaximize,
    handleRestore : handleRestore,
    handlePrefModified: handlePrefModified
};



/**
 * g:onload
 * @param window
 * @param widgetInstance
 * @param log
 */
function handleLoad(window, widgetInstance, log) {
    var event = 'onload';
    var gOnloadAttr = getEventAttribute(event, widgetInstance.body);
    if(gOnloadAttr) {
        executeScript(window, widgetInstance.id, gOnloadAttr, event, log);
    }
}

/**
 * g:onPrefModified
 * @param window
 * @param widgetInstance
 * @param log
 */
function handlePrefModified(window, widgetInstance, log) {
    var event = 'onPrefModified';
    var gPrefModifiedAttr = getEventAttribute(event, widgetInstance.body);
    if(gPrefModifiedAttr) {
        widgetInstance.model.addEventListener('PrefModified', function() {
            executeScript(window, widgetInstance.id, gPrefModifiedAttr, event, log);
        });
    }
}

/**
 * g:onmaximize
 * @param window
 * @param widgetInstance
 * @param chromeNode
 * @param log
 */
function handleMaximize(window, widgetInstance, chromeNode, log) {
    var event = 'onmaximize';
    var gMaximizeAttr = getEventAttribute(event, widgetInstance.body);
    if(gMaximizeAttr) {
        chromeNode.addEventListener('click', function(ev) {
            if(ev.target.getAttribute('data-cxp-viewmode') === 'maximized') {
                executeScript(window, widgetInstance.id, gMaximizeAttr, event, log);
            }
        });
    }
}

/**
 * g:onrestore
 * @param window
 * @param widgetInstance
 * @param chromeNode
 * @param log
 */
function handleRestore(window, widgetInstance, chromeNode, log) {
    var event = 'onrestore';
    var gRestoreAttr = getEventAttribute(event, widgetInstance.body);
    if(gRestoreAttr) {
        chromeNode.addEventListener('click', function(ev) {
            if(ev.target.getAttribute('data-cxp-viewmode') === 'windowed') {
                executeScript(window, widgetInstance.id, gRestoreAttr, event, log);
            }
        });
    }
}

/**
 * Utility to get the value of g namespaced attribute (g:onload). Getting attributes with namespaces can be fickle
 * @param attrName
 * @param widgetBodyNode
 * @return {*}
 */
function getEventAttribute(attrName, widgetBodyNode) {
    var el = widgetBodyNode.querySelector('div[g\\:' + attrName + ']'); //need to escape in query selector
    if(el) {
        return el.getAttribute('g:' + attrName);
    }

    return null;
}

/**
 * Evaluates a script that you'd expect to find in a g namespace handler
 * @param window
 * @param widgetId
 * @param scriptText
 * @param eventName
 * @param log
 */
function executeScript(window, widgetId, scriptText, eventName, log) {
    try {
        log.debug('Executing g:%s script...', eventName);
        var widgetAccessor = window.widgets ? 'window.widgets[\'' + widgetId + '\']' : 'window.widget';
        var script = scriptText.replace(/(__WIDGET__|__GADGET__)/, widgetAccessor);
        window.eval('(function() {' + script + '})()');  // jshint ignore:line
    } catch (e) {
        log.warn('g:%s failed!', eventName);
        log.error(e);
    }
}
},{}],108:[function(require,module,exports){
'use strict';

var EventTarget = require('event-target');

/**
 * This plugins adds a few features that deviate from the spec to support running Widgets in CXP environments
 * @param opts
 * @constructor
 */
var CxpAdditionsPlugin = function() {
    this.name = 'CXP Additions Plugin';
};

/**
 * Mixes in an EventTarget impl to the widget interface
 * @param widgetInstance
 */
CxpAdditionsPlugin.prototype.preRender = function(widgetInstance) {

    //add event listener
    widgetInstance.addEventListener = EventTarget.addEventListener;
    widgetInstance.removeEventListener = EventTarget.removeEventListener;
    widgetInstance.dispatchEvent = EventTarget.dispatchEvent;

    //if the event target for storage events wasn't already set, default it to the widget instance
    var eventTarget = widgetInstance.preferences.eventTarget = widgetInstance.preferences.eventTarget || [];

    // TODO: we need to remove widgetInstance from collection of event targets when it's destroyed. Currently
    // we have no means to be notified of that event.
    if(eventTarget.indexOf(widgetInstance) === -1) {
        eventTarget.push(widgetInstance);
    }

    return widgetInstance;
};

module.exports = CxpAdditionsPlugin;
},{"event-target":2}],109:[function(require,module,exports){
'use strict';

var loggerFactory = require('../util/logger-factory');
var bunyan = require('browser-bunyan');

/**
 * @class ReplaceConfigVarsPlugins
 * @param varMap
 * @param opts
 * @constructor
 */
var ReplaceConfigVarsPlugins = function (varMap, opts) {
    opts = opts || {};

    this.name = 'Replace Config Vars';
    this.varMap = varMap;
    this.full = !!opts.full;
    this.interpolateStartRegex = opts.interpolateStartRegex || '\\$\\(';
    this.interpolateEndRegex = opts.interpolateEndRegex || '\\)';
    this.log = loggerFactory.getLogger();
};

/**
 * Fix paths in the model
 * @param widgetModel
 */
ReplaceConfigVarsPlugins.prototype.postRead = function (widgetModel) {

    var self = this;
    var log = this.log;

    log.info('Replace config vars plugin is running is POST READ phase...');

    if (self.full) {
        log.debug('Doing full config vars replacement...');
        self._traverse(widgetModel);
    } else {
        log.debug('Doing minimal config vars replacement (just widget src and icons array)...');

        if (widgetModel.content && widgetModel.content.src) {
            widgetModel.content.src = self._replaceVars('src', widgetModel.content.src);
        }

        if (widgetModel.content && widgetModel.content.config) {
            widgetModel.content.config = self._replaceVars('config', widgetModel.content.config);
        }

        if (widgetModel.icons) {
            widgetModel.icons.forEach(function (icon, index, icons) {
                icons[index] = self._replaceVars('icons[' + index + ']', icon);
            });
        }
        
        //special preferences
        widgetModel.preferences = widgetModel.preferences.map(function(pref) {
            if(pref.name === 'messages') {
                pref.value =  self._replaceVars('messages', pref.value);
            }
            return pref;
        });

        if (widgetModel.datasources) {
            var datasources = widgetModel.datasources;
            self._traverse(datasources);
        }
    }

    log.info('Replace config vars plugin in POST READ is DONE.');

    return widgetModel;
};

/**
 * Traverse object
 * @param {Object.<string, *>} obj
 * @private
 */
ReplaceConfigVarsPlugins.prototype._traverse = function (obj) {
    var self = this;

    if (obj._ignoreReplace) {
        return;
    }

    Object.keys(obj).forEach(function (key) {
        obj[key] = self._replaceVars(key, obj[key]);

        if (!!obj[key] && typeof obj[key] === 'object') {
            self._traverse(obj[key]);
        }
    });
};

/**
 * Replace vars
 * @param key
 * @param value
 * @returns {*}
 * @private
 */
ReplaceConfigVarsPlugins.prototype._replaceVars = function (key, value) {
    if (typeof value !== 'string') {
        return value;
    }

    var self = this;
    var log = self.log;
    var varMap = self.varMap;

    var urlVars = Object.keys(varMap);

    urlVars.forEach(function (urlVar) {
        var varRegexp = new RegExp(self.interpolateStartRegex + urlVar + self.interpolateEndRegex, 'g');

        if (log.level() <= bunyan.DEBUG && varRegexp.test(value)) {
            log.debug('Replacing occurences of [%s] with [%s] where [%s=%s]',
                varRegexp, varMap[urlVar], key, value);
        }

        value = value.replace(varRegexp, varMap[urlVar]);
    });

    return value;
};

module.exports = ReplaceConfigVarsPlugins;

},{"../util/logger-factory":121,"browser-bunyan":1}],110:[function(require,module,exports){
'use strict';

var ConfigParser = require('../../core/config-parser');

/**
 * This parser passes the object straight through.
 * It exists so the AutoConfigParser will pass pre-parsed models straight through with modification
 * @constructor
 */
var JsObjectParser = function() {
};
JsObjectParser.prototype = Object.create(ConfigParser.prototype);

/**
 *
 * @param xml
 * @returns {*}
 */
JsObjectParser.prototype.parse = function(object) {
   //pass straight through. Could perform validation, patches etc here if we need
   return object;
};

module.exports = JsObjectParser;
},{"../../core/config-parser":89}],111:[function(require,module,exports){
'use strict';

var Html5SeamlessRenderer = require('./html5-seamless-renderer');

var Html5ContainerRenderer = function(widgetEl, opts) {
    Html5SeamlessRenderer.call(this, widgetEl, opts);
    this.isContainer = true;
    this.areaMap = null;
};
Html5ContainerRenderer.prototype = Object.create(Html5SeamlessRenderer.prototype);

Html5ContainerRenderer.prototype.getAreaNodes = function() {

    var self = this;
    if(!this.areaMap) {
        self.areaMap = {};
        var areas = Array.prototype.slice.call(this.widgetEl.querySelectorAll('div[data-area]'));
        areas.forEach(function(area) {
            var areaKey = area.getAttribute('data-area');
            self.areaMap[areaKey] = area;
        });
    }
    return this.areaMap;
};

module.exports = Html5ContainerRenderer;
},{"./html5-seamless-renderer":112}],112:[function(require,module,exports){
(function (global){
/* global window: false, document: false, DOMParser: false*/

'use strict';

var fetch = global.fetch;
var XMLHttpRequest = global.XMLHttpRequest; // jshint ignore:line

var PreprocessingWidgetRenderer = require('../../core/preprocessing-widget-renderer');
var WidgetError = require('../../core/widget-error');
var errorCodes = require('../../core/widget-error-codes');
var util = require('../../util/util');
var fetchFile = require('../../util/fetch-file');
var loggerFactory = require('../../util/logger-factory');
var bunyan = require('browser-bunyan');
var url = require('url');

//caches
var fetchPromises = {};
var getResourceLoader = require('./util/resource-loader');

//reference to shared DOMParser instance
var parser = null;

var Html5SeamlessRenderer = function(widgetContainerEl, opts) {

    PreprocessingWidgetRenderer.call(this);

    //check some built in dependencies
    if(typeof window.DOMParser === 'undefined') {
        throw new Error('DOMParser is not shimmed or a native object. This renderer will not work');
    }

    opts = opts || {};
    this.widgetContainerEl = widgetContainerEl;
    this.parsingFormat = opts.parsingFormat || null;
    this.locale = opts.locale || null;
    this.configVars = opts.configVars || {};
    this.useFolderLocalization = opts.useFolderLocalization || false;
    this.log = loggerFactory.getLogger();

    // created dom elements during the rendering. We can use this references to destroy widget and clean up dom
    this.widgetEl = null;
    this._widgetInstanceReferences = [];
    this._inlineScriptTags = [];
};

Html5SeamlessRenderer.prototype = Object.create(PreprocessingWidgetRenderer.prototype);

Html5SeamlessRenderer.prototype.fetchStartFile = function(path, widgetModel) {

    this.path = path;

    var log = this.log;
    log.debug('Starting HTML5 seamless rendering...');

    //get the widget start file
    var startFilePaths = this.getStartFilePaths(path, widgetModel, this.locale);

    if(!this.useFolderLocalization) {
        startFilePaths = startFilePaths.slice(0, 1);
    }

    var startFile = startFilePaths.pop();
    this.startFileDir = startFile.substring(0, startFile.lastIndexOf('/') + 1);

    log.debug('Using widget start file @ %s', startFile);

    var result = fetchPromises[startFile];

    if(!result) {
        log.debug('Requesting start file...');
        //we cannot use fetch to get local files on mobile
        var fetchStartFile = util.isUrlForFile(startFile) ? fetchFile : fetch;
        result = fetchStartFile(startFile, {credentials: 'same-origin'}).then(function(res) {
            log.debug('Start file request resolved/ Status: %s', res.status);

            if (res.status === 0 || res.status === 200) {
                return res.text();
            } else {
                var error = new Error(res.statusText);
                error.code = res.status;

                throw error;
            }
        }).then(function(html) {
            log.trace('Received HTML\n: %s', html);
            return html;
        }).catch(function(e) {
            var error = new WidgetError(e, 'Failed to fetch ' + startFile);

            // get error code that is a HTTP response code and convert it into a widget engine code
            if (e.code === 404) {
                error.code = errorCodes.STARTFILE_NOT_FOUND;
            }

            throw error;
        });

        // save successful promise in cache
        result.then(function() {
            fetchPromises[startFile] = result;
        });
    }

    return result;
};

Html5SeamlessRenderer.prototype.process = function(widgetModel, widgetInstance, html) {

    var self = this;
    var log = this.log;
    var resourceLoader = getResourceLoader();

    var scriptStart = '/*seamless widget wrapper*/\n(function(widget) {\n';
    var scriptEnd = '\n})( window.widgets[\'' + widgetModel.id + '\'])';

    if(!parser) {
        parser = new DOMParser();
    }

    var format = this.parsingFormat || 'text/html';
    var doc = parser.parseFromString(html, format);

    window.widgets = window.widgets || {};
    window.widgets[widgetModel.id] = widgetInstance;

    this._widgetInstanceReferences.push(widgetModel.id);

    //baseURI
    Object.defineProperty(widgetInstance, 'baseURI',  {
        enumerable: true,
        value: this.path
    });

    //load links
    var cssToLoad = [];
    var links = Array.prototype.slice.call(doc.getElementsByTagName('link'));
    links.forEach(function(link) {
        if(link.rel === 'stylesheet' && link.getAttribute('href')) {
            //make doc relative paths absolute
            var href = link.getAttribute('href');
            href = self._replacePathVars(href);
            if(util.isUrlDocumentRelative(href)) {
                href = url.resolve(self.startFileDir, href);
            }
            link.parentNode.removeChild(link);
            cssToLoad.push(href);
        }
    });

    if(log.level() <= bunyan.DEBUG) {
        log.debug('Using resource loader to load %s CSS resource(s): %s ...', cssToLoad.length, cssToLoad.join(', '));
    }

    resourceLoader.loadCss(cssToLoad);

    //style tags, move to head
    var styles = Array.prototype.slice.call(doc.getElementsByTagName('style'));
    styles.forEach(function(style) {
        document.head.appendChild(style);
    });

    //wrap all scripts
    var scriptsToLoad = [];
    var scriptsToInline = [];
    var scripts = Array.prototype.slice.call(doc.getElementsByTagName('script'));
    scripts.forEach(function(script) {
        var scriptContent = script.innerHTML;
        if(scriptContent) {
            if(!script.type || script.type === 'text/javascript') {
                //scripts with content (not a src attr)
                log.trace('Queuing script to inline:\n%s', scriptContent);
                scriptsToInline.push(scriptContent);
            }
        } else {
            //scripts with src attr
            //make doc relative paths absolute
            var src = script.getAttribute('src');
            if(src) {
                src = self._replacePathVars(src);
                if(util.isUrlDocumentRelative(src)) {
                    src = url.resolve(self.startFileDir, src);
                }

                scriptsToLoad.push(src);
            }
        }
    });

    if(log.level() <= bunyan.DEBUG) {
        log.debug('Using resource loader to load %s JS resource(s): %s ...',
            scriptsToLoad.length, scriptsToLoad.join(', '));
    }
    var scriptsLoadingPromise = resourceLoader.loadScripts(scriptsToLoad);

    //fix relative image urls
    var images = Array.prototype.slice.call(doc.getElementsByTagName('img'));
    images.forEach(function(image) {
        var originalSrc = image.getAttribute('src');
        if(originalSrc) {
            var src = self._replacePathVars(originalSrc);
            if(util.isUrlDocumentRelative(src)) {
                var resolvedSrc = url.resolve(self.startFileDir, src);
                src = resolvedSrc;
                log.debug('Image src updated from [%s] to [%s].', originalSrc, resolvedSrc);
            }
            if(image.getAttribute('src') !== src) {
                image.src = src;
            }
        }
    });

    //create the widget element
    var widgetNode = document.createElement('div');
    widgetNode.id = widgetModel.id;
    widgetNode.setAttribute('data-widget', widgetModel.name);
    Object.defineProperty(widgetInstance, 'body',  {
        enumerable: true,
        writable: true, //required so Backbase Plugin can change this
        value: widgetNode
    });

    //set widget dimensions
    function addUnits(val) {
        if(isNaN(parseInt(val))) {
            return val;
        }
        return val + 'px';
    }

    if(widgetModel.width) {
        widgetNode.style.width = addUnits(widgetModel.width);
        log.debug('Widget width set to %s.', widgetNode.style.width);
    }

    if(widgetModel.height) {
        widgetNode.style.height = addUnits(widgetModel.height);
        log.debug('Widget height set to %s.', widgetNode.style.height);
    }

    var body = doc.getElementsByTagName('body')[0];

    //save event attributes to execute later
    var onloadAttr = body.getAttribute('onload');

    //add body attrs to root widget el
    for (var i = 0; i < body.attributes.length; i++) {
        var attrib = body.attributes[i];
        if (attrib.specified) {
            if(attrib.name !== 'onload') {
                widgetNode.setAttribute(attrib.name, attrib.value);
            }
        }
    }

    //html to dom
    widgetNode.innerHTML = body.innerHTML;
    this.widgetContainerEl.appendChild(widgetNode);
    this.widgetEl = widgetNode;

    //invoke events
    return scriptsLoadingPromise.then(function(inspections) {
        log.debug('JS resources have loaded.');

        if(inspections) {
            var errorCount = inspections.filter(function(scriptLoadInspection) {
                return scriptLoadInspection.isRejected();
            }).length;
            if(errorCount > 0) {
                log.warn('%s scripts failed to load.', errorCount);
            }
        }

        if(onloadAttr) {
            scriptsToInline.push(onloadAttr);
            log.debug('Found onload attribute to execute [%s]', onloadAttr);
        }
        log.debug('Adding %s inline script(s). (Including an onload attribute if any)...', scriptsToInline.length);
        var wrappedScript = scriptStart + scriptsToInline.join('\n') + scriptEnd;
        var inlineScriptEl = document.createElement('script');
        inlineScriptEl.innerHTML = wrappedScript;
        document.body.appendChild(inlineScriptEl);

        self._inlineScriptTags.push(inlineScriptEl);
    }).catch(function(e) {
        throw new WidgetError(e, 'Failed to render HTML5 seamless widget');
    });
};

Html5SeamlessRenderer.prototype.getWidgetNode = function() {
    return this.widgetEl || null;
};

Html5SeamlessRenderer.prototype.getParentNode = function() {
    return this.widgetContainerEl || null;
};

Html5SeamlessRenderer.prototype.setParentNode = function(widgetContainerEl) {
    this.widgetContainerEl = widgetContainerEl;
};

Html5SeamlessRenderer.prototype.getWidth = function() {
    return this.getWidgetNode() ? this.getWidgetNode().offsetWidth : 'auto';
};

Html5SeamlessRenderer.prototype.getHeight = function() {
    return this.getWidgetNode() ? this.getWidgetNode().offsetHeight : 'auto';
};

/**
 * Replaces placeholders in a string using the configVar map.
 * @param {String} path The path to replace using the config vars
 * @returns {String} The updatedp path
 * @private
 */
Html5SeamlessRenderer.prototype._replacePathVars = function(path) {

    var log = this.log;
    var varMap = this.configVars;

    for (var urlVar in varMap) {
        if (varMap.hasOwnProperty(urlVar)) {
            var varRegexp = new RegExp('\\$\\(' + urlVar + '\\)', 'g');

            if (log.level() <= bunyan.DEBUG && varRegexp.test(path)) {
                log.debug('Updating resource url. Replacing %s for %s in [%s]', varRegexp, varMap[urlVar], path);
            }

            path = path.replace(varRegexp, varMap[urlVar]);
        }
    }

    return path;
};

Html5SeamlessRenderer.prototype.destroy = function () {
    // Try to find chrome around
    var widgetName = this.widgetEl.getAttribute('data-widget');
    var parent = this.widgetEl.parentElement;
    var chrome = null;

    while (parent) {
        var chromeName = parent.getAttribute('data-chrome');
        if (chromeName === widgetName) {
            chrome = parent;
            break;
        }

        parent = parent.parentElement;
    }

    // Remove widget DOM
    if (chrome) {
        chrome.parentElement.removeChild(chrome);
    } else {
        this.widgetEl.parentElement.removeChild(this.widgetEl);
        this.widgetEl = null;
    }

    // Remove created script tags for inline scripts
    this._inlineScriptTags.forEach(function (scriptElement) {
        scriptElement.parentElement.removeChild(scriptElement);
    });
    this._inlineScriptTags = [];

    // Remove widget instance references
    this._widgetInstanceReferences.forEach(function (modelId) {
        delete window.widgets[modelId];
    });
    this._widgetInstanceReferences = [];
};

/**
 * Clears cache of start file promises.
 * @private
 */
Html5SeamlessRenderer.prototype._clearCache = function() {
    fetchPromises = {};
};

module.exports = Html5SeamlessRenderer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../core/preprocessing-widget-renderer":92,"../../core/widget-error":95,"../../core/widget-error-codes":94,"../../util/fetch-file":119,"../../util/logger-factory":121,"../../util/util":123,"./util/resource-loader":115,"browser-bunyan":1,"url":131}],113:[function(require,module,exports){
'use strict';

var Handlebars = require('handlebars/dist/handlebars.min');
var HandlebarsHelpers = require('handlebars-helpers');
var WidgetError = require('../../../core/widget-error');
var loggerFactory = require('../../../util/logger-factory');
var i18n = require('../../../util/i18n');
if(i18n.intlSupported) {
    var HandlebarsIntl = require('handlebars-intl');
}

/**
 * Constructs a Handlebars Preprocessor.
 * This will also automatically add the following CXP helpers to Handlebars:
 * * range
 * * getPreferenceValue
 * * math
 * Compiled templates are cached
 * @constructor
 */
var HandlebarsPreprocessor = function(config) {
    this.name = 'Handlebars Preprocessor';
    this.log = loggerFactory.getLogger();
    this.dataObj = {
        cxpConfig: config || {}
    };

    this.templateCache = {};
    this.hbs = Handlebars.create();

    //add default helpers for cxp support
    var helpers = HandlebarsPreprocessor.cxpHelpers;
    for(var helperName in helpers) {
        if(helpers.hasOwnProperty(helperName)) {
            this.hbs.registerHelper(helperName, helpers[helperName]);
        }
    }

    //don't enable Format Js features if Intl API is not available (it requires a polyfill on Safari)
    if(HandlebarsIntl) {
        HandlebarsIntl.registerWith(this.hbs);
    } else {
        this.log.warn('The ECMAScript Internationalization API is not supported on this platform. ' +
                      'Some i18n related features will fail.');
    }
};

/**
 * Processes a start file that is expected to be a handlebars template.
 * If the widget start file has a `.js` extension, it assumed the template was precompiled with the 'simple' option.
 * E.g. <code>handlebars index.handlebars -s -f index.js</code>
 * @param widgetModel
 * @param startFileContent
 * @param context
 * @param messageBundle
 * @returns {string} a preprocessed start file
 */
HandlebarsPreprocessor.prototype.process = function(widgetModel, startFileContent, context, messageBundle) {

    var log = this.log;
    var errMessage;

    var templateKey = widgetModel.content.src;
    var template = this.templateCache[templateKey];

    if(!template) {
        //if the start file ends with js, assume it is a precompiled template
        if(widgetModel.content.type && widgetModel.content.type === 'application/x-handlebars-template') {
            //precompiled templates must be evaulated, so this is why we use eval
            var precompiledTemplate = null;
            try {
                eval('precompiledTemplate = ' + startFileContent); // jshint ignore:line
                template = this.hbs.template(precompiledTemplate);
            } catch(err) {
                errMessage =
                    'There was a problem evaluating a pre-compiled handlebars template. ' +
                    'Ensure it was compiled using the simple option. E.g.' +
                    '`handlebars index.handlebars -s -f index.js`';
                this.log.error(err, errMessage);
                throw new WidgetError(err, errMessage);
            }

        } else {
            log.debug('Compiling handlebars template instance for %s', templateKey);
            try {
                template = this.hbs.compile(startFileContent);
            } catch(err) {
                errMessage = 'There was a problem compiling a handlebars template';
                this.log.error(err, errMessage);
                throw new WidgetError(err, errMessage);
            }
        }
        this.templateCache[templateKey] = template;
    }
    
    if(messageBundle) {
        var messages = messageBundle.messages || {};
        var formats = messageBundle.formats || {};
        var availableLocales = Object.keys(messages);
        var bestFitLocale = i18n.chooseBestLocale(availableLocales, widgetModel.locale);

        this.dataObj.intl = {
            locales: widgetModel.locale,
            //TODO: consider merging messages by locale fit priority
            //see https://github.com/l20n/l20n.js/blob/v1.0.x/lib/l20n/intl.js
            messages: messages[bestFitLocale] || messages[i18n.defaultLocale] || {},
            formats: formats
        };
    }

    var result = template(context, { data: this.dataObj });
    log.trace('Using compiled Handlebars start file for %s:\n%s', templateKey, result);
    return result;
};

/**
 * Registers a handlebars helper with the internal handlebars instance
 * @param {string} name
 * @param {Function} helper
 */
HandlebarsPreprocessor.prototype.registerHelper = function(name, helper) {

    this.hbs.registerHelper(name, helper);
};

/**
 * Registers a handlebars partial with the internal handlebars instance
 * @param {string} name
 * @param {Function} partial
 */
HandlebarsPreprocessor.prototype.registerPartial = function(name, partial) {

    this.hbs.registerPartial(name, partial);
};

HandlebarsPreprocessor.cxpHelpers = HandlebarsHelpers;

module.exports = HandlebarsPreprocessor;

},{"../../../core/widget-error":95,"../../../util/i18n":120,"../../../util/logger-factory":121,"handlebars-helpers":3,"handlebars-intl":4,"handlebars/dist/handlebars.min":27}],114:[function(require,module,exports){
/* jshint strict: true */
/* globals soy: false, DOMParser: false */

'use strict';

var WidgetError    = require('../../../core/widget-error');
var loggerFactory  = require('../../../util/logger-factory');
var resourceLoader = require('../util/resource-loader')();
var util           = require('../../../util/util');

var convertToArray = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * Constructs a Soy Template Preprocessor.
 * Compiled templates are cached
 * @constructor
 */
var SoyPreprocessor = function(configVars) {
    this.name = 'Soy Preprocessor';
    this.log = loggerFactory.getLogger();
    this.configVars = configVars;
};

/**
 * Processes a start file that is expected to be a compiled soy template.
 * @param widgetModel
 * @param startFileContent
 * @param context
 * @returns {string} a preprocessed start file
 */
SoyPreprocessor.prototype.process = function(widgetModel, startFileContent, context) {
    var self = this;
    var log = this.log;

    if(typeof soy === 'undefined') {
        throw new WidgetError('Soy utils are not present. Cannot use Soy start file');
    }

    //the start file is the soy container's `config.xml` file. Parse out the resources...
    var parser = new DOMParser();
    var configDoc = parser.parseFromString(startFileContent, 'application/xml');
    var resources = configDoc.getElementsByTagName('resources')[0];
    resources = resources || configDoc.getElementsByTagName('bb:resources')[0];

    if (!resources) {
        throw new WidgetError('"resources" element not found in config.xml');
    }

    var templateName = getPreference(widgetModel, 'TemplateName').value;

    //filter out the template script, we want to load this separately from regular resources
    var templateScriptRegex = new RegExp('/templates/' + templateName + '/template\\.js$');
    var templateScriptNode = convertToArray(resources.children).filter(function(script) {
        return templateScriptRegex.test(script.getAttribute('src'));
    })[0];
    if(templateScriptNode) {
        resources.removeChild(templateScriptNode);
    }
    var templateSrc = util.replacePathVars(templateScriptNode.getAttribute('src'), this.configVars, this.log);

    //load the compiled soy template, it will be added as a global var
    return resourceLoader.loadScripts(templateSrc).then(function() {
        //Create a wrapper dom object to append links and scripts to
        var startFileEl = document.createElement('div');
        var templateNamespace = 'window.templates_' + templateName;
        var fragment = null;
        var template = null;

        try {
            eval('template = ' + templateNamespace);  // jshint ignore:line
            fragment = soy.renderAsFragment(template[templateName], {
                item: createTemplateItemData(context),
                ij:   self.configVars
            });
        } catch(err) {
            var errMessage = 'There was a problem evaluating a pre-compiled Soy template.';
            log.error(err, errMessage);
            throw new WidgetError(err, errMessage);
        }

        //add the remaining resources
        startFileEl.innerHTML = resources.innerHTML;

        //append the rendered template
        startFileEl.appendChild(fragment);

        //convert areas to cxp6 style with [data-area] attributes
        var areaNodes = convertToArray(fragment.getElementsByClassName('bp-area'));
        areaNodes.forEach(function(areaNode, i) {
            areaNode.setAttribute('data-area', i);
        });

        var result = startFileEl.outerHTML;
        log.trace('Using compiled Soy start file for %s:\n%s', templateNamespace, result);

        return result;
    });
};

function getPreference(widgetModel, name) {
    return widgetModel.preferences.filter(function(pref) {
        return pref.name === name;
    })[0] || null;
}

//convert the widgetModel into the format required by the soy template
function createTemplateItemData(widgetModel) {

    var templateData = {};

    templateData.name = widgetModel.name;
    templateData.children = widgetModel.children || [];

    //preferences
    templateData.preferences = array2Dict(widgetModel.preferences || [], 'name');
    templateData.children = templateData.children.map(createTemplateItemData);

    return templateData;
}

function array2Dict (array, keyFieldName) {
    return array.reduce(function(templatePrefs, pref) {
        templatePrefs[pref[keyFieldName]] = pref;
        return templatePrefs;
    }, {});
}

module.exports = SoyPreprocessor;

},{"../../../core/widget-error":95,"../../../util/logger-factory":121,"../../../util/util":123,"../util/resource-loader":115}],115:[function(require,module,exports){
'use strict';

var Promise = require('promise-extensions')(Promise);

var _loaderInstance;

function ResourceLoader() {
    this._initilized = false;
    this._allLoadingPromises = {};
}

module.exports = function() {
    if (!_loaderInstance){
        _loaderInstance = new ResourceLoader();
    }
    return _loaderInstance;
};

/**
 * Lazily initializes an instance of resource loader.
 * As this object relies on existence of <code>document</code> free variable which may not exist at the moment
 * an instance of resource loader is created.
 * @private
 */
ResourceLoader.prototype._init = function() {
    if (this._initilized) {
        return;
    }

    this.head = document.getElementsByTagName('head')[0] || document.documentElement;
    this.asyncSupported = typeof document.createElement('script').async !== 'undefined';

    this._prepopulateLoadedCache();

    this._initilized = true;
};

ResourceLoader.prototype._prepopulateLoadedCache = function() {

    var isLoadable, src;
    var self = this;

    var preloadedLinks = Array.prototype.slice.call(document.getElementsByTagName('link'));
    preloadedLinks.forEach(function(link) {
        src = link.getAttribute('href');
        isLoadable = link.rel === 'stylesheet' && src;
        if(isLoadable) {
            self._allLoadingPromises[src ] = src;
        }
    });

    var preloadedScripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
    preloadedScripts.forEach(function(script) {
        src = script.getAttribute('src');
        isLoadable = !script.innerHTML && src;
        //a note about async scripts:
        //if a script that is already on the page is marked async. Its not possible to guarantee here that the script
        //has completed loading and executing, so it's not added in the loaded script cache. Therefore a script marked
        //async in the page template is likely to be reloaded, if used again in a widget.
        if(isLoadable && !script.async && !self._allLoadingPromises[src]) {
            self._allLoadingPromises[src] = Promise.resolve(src);
        }

    });
};

ResourceLoader.prototype.loadScripts = function(scripts) {

    if(!(scripts instanceof Array)) {
        scripts = [ scripts ];
    }

    this._init();
    return this.asyncSupported ? this._loadScriptsAsync(scripts) : this._loadScriptsSync(scripts);
};

//modern approach
ResourceLoader.prototype._loadScriptsAsync = function(scripts) {

    var self = this;

    //this loads all the unloaded scripts asyncronously, but should execute them in order
    // (by turning async off after assigning the source)
    var scriptLoadPromises = scripts.filter(function(src) {
        return !self._allLoadingPromises[src];
    }).map(function(src) {
        
        var scriptEl = document.createElement('script');
        scriptEl.src = src;
        scriptEl.async = false;

        var loadPromise = self._createScriptPromise(scriptEl);

        self._allLoadingPromises[scriptEl.src] = loadPromise;
        self.head.insertBefore(scriptEl, self.head.firstChild );

        return loadPromise;
    });

    return Promise.settleAll(scriptLoadPromises);
};

//legacy approach
ResourceLoader.prototype._loadScriptsSync = function(scripts) {

    var self = this;
    var loadedPromises = [];

    function loadScript(src) {
        if(!self._allLoadingPromises[src]) {
            var scriptEl = document.createElement('script');
            scriptEl.src = src;

            self._allLoadingPromises[src] = self._createScriptPromise(scriptEl);
            loadedPromises.push(self._allLoadingPromises[src]);
            self.head.insertBefore( scriptEl, self.head.firstChild );
        }

        return self._allLoadingPromises[src];
    }

    //this loads all and executes all the external scripts in order for browsers who do not support async script loading
    function loadNextScript(i) {
        var promise = loadScript(scripts[i]);
        i++;
        if(scripts[i]) {
            return promise.then(function() {
                return loadNextScript(i);
            })
            .catch(function() {
                return loadNextScript(i);
            });
        } else {
            return loadedPromises;
        }
    }

    return scripts.length ? Promise.settleAll(loadNextScript(0)) : Promise.resolve();
};

ResourceLoader.prototype._createScriptPromise = function(scriptEl) {
    var src = scriptEl.src;
    return new Promise(function(resolve, reject) {

        scriptEl.onload = function() {
            resolve(src);
        };

        scriptEl.onerror = function() {
            reject(src);
        };
    });
};

ResourceLoader.prototype.loadCss = function(hrefs) {

    if(!(hrefs instanceof Array)) {
        hrefs = [ hrefs ];
    }

    this._init();

    var self = this;
    var head = self.head;
    var currentBatch = [];

    hrefs.forEach(function(src) {

        if(self._allLoadingPromises[src]) {
            currentBatch.push(self._allLoadingPromises[src]);
        } else {
            var newLinkEl = document.createElement('link');
            newLinkEl.setAttribute('rel', 'stylesheet');
            newLinkEl.setAttribute('type', 'text/css');
            newLinkEl.setAttribute('href', src);

            var promise = Promise.resolve(src);

            self._allLoadingPromises[src] = promise;
            currentBatch.push(promise);

            //logic to insert after last stylesheet element in head
            var sheetLinksEls = Array.prototype.slice.call(head.getElementsByTagName('link')).filter(function(el) {
                return el.rel === 'stylesheet';
            });
            if(sheetLinksEls.length) {
                var lastLinkEl = sheetLinksEls.pop();
                lastLinkEl.parentNode.insertBefore(newLinkEl, lastLinkEl.nextSibling);
            } else {
                head.insertBefore(newLinkEl, head.firstChild);
            }
        }
    });

    return Promise.all(currentBatch);
};

},{"promise-extensions":87}],116:[function(require,module,exports){
/* global window: false*/
'use strict';

var WidgetStorage = require('./web-storage-decorator');

function Html5LocalStorage() {
    WidgetStorage.call(this, window.localStorage);
}
Html5LocalStorage.prototype = Object.create(WidgetStorage.prototype);

module.exports = Html5LocalStorage;
},{"./web-storage-decorator":118}],117:[function(require,module,exports){
'use strict';
var util = require('../../util/util');

/**
 * This class implements [StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent)
 *
 * It would be preferable to use the native StorageEvent class, but doing seemed too difficult; the final argument when
 * calling <code>initStorageEvent</code> must be a valid StorageArea implementation, but I was not able to figure out
 * how to make Firefox think custom storage areas implement the native Storage interface.
 *
 * This event may not work if using it on native EventTarget implementations such as the <code>window</code> object
 *
 * @exports the StorageEvent constructor
 * @type {StorageEvent|exports}
 */

/**
 * Constructor
 * @param type
 * @constructor
 */
function StorageEvent(type) {
    this.type = type;
}

/**
 * Initializes the event in a manner analogous to the similarly-named method in the DOM Events interfaces.
 * @param {String} type The name of the event.
 * @param {Boolean} canBubble A boolean indicating whether the event bubbles up through the DOM or not.
 * @param {Boolean} cancellable A boolean indicating whether the event is cancelable.
 * @param {String} key The key whose value is changing as a result of this event.
 * @param {String} oldValue The key's old value.
 * @param {String} newValue The key's new value.
 * @param {String} url
 * @param {Object} storageArea The DOM Storage object representing the storage area on which this event occurred.
 */
StorageEvent.prototype.initStorageEvent = function(type, canBubble, cancellable, key, oldValue, newValue, url,
                                                   storageArea) {
    this.type = type;
    this.canBubble = canBubble;
    this.cancellable = cancellable;
    this.key = key;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.url = url;
    this.storageArea = storageArea;
};

StorageEvent.prototype.toString = function() {
    return util.format('[object StorageEvent] (key=%s, oldValue=%s, newValue=%s, url=%s)',
        this.key, this.oldValue, this.newValue, this.url);
};

module.exports = StorageEvent;
},{"../../util/util":123}],118:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Use this module to help build new Widget Storage implementations or adapt existing WebStorage implementations
 *
 * The WidgetStorage class provides an <code>init</code> method which initializes the web storage with a set of
 * preferences from a widget's configuration, ensuring readonly preferences are respected
 *
 * When storing widget preferences it will prefix them with the widget's instance id so multiple widgets can
 * share the same storage environment.
 *
 * @example
 *
 * var MyStorageImpl = function() {
 *  var storage = new WebStorageImpl();
 *  WebStorageDecorator.call(this, storage);
 * };
 * MyStorageImpl.prototype = Object.create(WebStorageDecorator.prototype);
 *
 * @exports the WebStorageDecorator constructor
 * @type {WidgetStorage|exports}
 */

//originally adapted from https://gist.github.com/tlrobinson/1334406
var loggerFactory = require('../../util/logger-factory');
var bunyan = require('browser-bunyan');
var WidgetStorage = require('../../core/widget-storage');
var WidgetError = require('../../core/widget-error');
var StorageEvent = require('./storage-event');
var util = require('../../util/util');

/**
 * WebStorageDecorator constructor for web storage
 * @param {Object} storage A web storage implementation. e.g. sessionStorage
 * @param {Object} [eventTarget] When WebStorage events are generated, they will be dispatched to this object
 * @constructor
 * @implements {WidgetStorage}
 */
function WebStorageDecorator(storage) {

    this.eventTarget = [];
    this.log = loggerFactory.getLogger();

    this._items = [];
    this._storage = storage;
    this._prefix = '';
    this._eventsEnabled = false; //enable after initialization

    //storage needs a length property
    var self = this;
    Object.defineProperty(this, 'length',  {
        enumerable: false,
        configurable: false,
        get: function () {
            return Object.keys(self._items).length;
        }
    });
}

WebStorageDecorator.prototype = Object.create(WidgetStorage.prototype);

/**
 * Initializes the storage
 * @param {string} widgetInstanceId
 * @param {Array} preferences
 */
WebStorageDecorator.prototype.init = function(widgetInstanceId, preferences) {

    var self = this;
    var log = this.log;
    this._prefix = widgetInstanceId || '';

    log.debug('Initializing preference storage for widget [%s]', widgetInstanceId);
    log.debug('Using internal storage [%s]', this._storage.toString());
    if(log.level() <= bunyan.TRACE) {
        log.trace('Initializing storage with the following preferences:\n %s', JSON.stringify(preferences));
    }

    if(preferences) {
        this._items = preferences.map(function(preference) {
            return self.defineItem(preference);
        });
    }

    //events are disabled until the storage is initialized
    this._eventsEnabled = true;
};

/**
 * Gets an item value from storage
 * @param {string} key
 * @returns {string}
 */
WebStorageDecorator.prototype.getItem = function(key) {

    //look for personalized value in storage
    var value = this._storage.getItem(this._prefix + key);
    if(typeof value === 'undefined' || value === null) {
        //revert to memory
        var item = this._getItemDefinition(key) || null;
        value = item ? item.value : null;
    }
    if(typeof value === 'undefined') {
        //must explicitly return null if the item does not exist
        value = null;
    }
    this.log.trace('Getting preference [%s=%s]', key, value);

    return value;
};

/**
 * Defines an item, so it is accessible as a property of the storage
 * @param {Object} pref
 */
WebStorageDecorator.prototype.defineItem = function(pref) {

    var self = this;
    var key = pref.name;

    this._items.push(pref);

    var propertyDescriptor = {
        enumerable: true,
        configurable: true,
        get: function () {
            return self.getItem(key);
        },
        set: function(val) {
            return self.setItem(self._prefix + key, val);
        }
    };
    Object.defineProperty(this, key, propertyDescriptor);

    return pref;
};

/**
 * Sets an item. Setting an item to null will remove it
 * @param {string} key
 * @param {string} value
 * @param {string} [type]
 * @returns {*}
 */
WebStorageDecorator.prototype.setItem = function(key, value, type) {

    //scenarios where setting the preference should fail
    var itemDefinition = this._getItemDefinition(key);
    if(itemDefinition && itemDefinition.readonly) {
        var errorMessage = util.format('Attempted to set readonly preference [%s=%s]', key, value);
        this.log.warn(errorMessage);
        throw new WidgetError(errorMessage);
    }

    this.log.debug('Setting preference to storage [%s=%s]', key, value);

    //behavior is that setting an item to null will remove it
    if(value === null) {
        return this.removeItem(key);
    } else {
        this._notify(key, this.getItem(key), value);
        return this._storage.setItem(this._prefix + key, value, type);
    }
};

/**
 * Clears personalization of an item
 * @param {string} key
 * @returns {string}
 */
WebStorageDecorator.prototype.removeItem = function(key) {

    this._notify(key, this.getItem(key), null);

    this.log.debug('Removing preference from storage [%s]', key);

    return this._storage.removeItem(this._prefix + key);
};

/**
 * Clears the storage area
 */
WebStorageDecorator.prototype.clear = function() {

    var self = this;

    this._notify(null, null, null);

    this.log.debug('Clearing preferences');

    //must disable events so removeItem does not fire events
    this._eventsEnabled = false;
    Object.keys(this._storage).filter(function(key) {
        return key.indexOf(self._prefix) === 0;
    }).forEach(function(key) {
        self.removeItem(key.substr(self.prefix.length));
    });
    this._eventsEnabled = true;
};

/**
 * Returns the nth key from the list of preferences
 * @returns {string} The key of the preference at the requested index
 */
WebStorageDecorator.prototype.key = function(n) {

    var self = this;

    var keys = Object.keys(this._storage).filter(function (key) {
        return key.indexOf(self._prefix) === 0;
    }).length;

    var numKeys = keys.length;
    if (n >= numKeys) {
        return null;
    }

    return keys[n];
};

/**
 * Gets an array of they keys stored
 * @deprecated (none standard)
 * @returns {Array}
 */
WebStorageDecorator.prototype.keys = function() {

    var self = this;

    var keys = Object.keys(this._storage).filter(function(key) {
        return key.indexOf(self._prefix) === 0;
    });

    if(keys.length === 0) {
        return [];
    }

    return keys.map(function(key) {
        return key.slice(self._prefix.length);
    });
};

WebStorageDecorator.prototype._getItemDefinition = function(key) {

    var pref = this._items.filter(function(item) {
        return key === item.name;
    })[0];

    return pref || null;
};

/**
 * Helper method for internally propagating storage events
 * @private
 * @param {string} key The key whose value is changing as a result of this event.
 * @param {string} oldVal The key's old value.
 * @param {string} newVal The key's new value.
 */
WebStorageDecorator.prototype._notify = function(key, oldVal, newVal) {
    if(!this._eventsEnabled) {
        return;
    }

    var self = this;
    var eventTargets = util.isArray(this.eventTarget) ? this.eventTarget : [this.eventTarget];

    eventTargets.filter(function(target) {
        return target !== undefined && target !== null;
    }).forEach(function(eventTarget) {
        if(typeof eventTarget.dispatchEvent !== 'function') {
            var message =
                'Cannot dispatch StorageEvent for preferences. ' +
                'An event target was provided, but it does not implement the EventTarget interface. [%s, %s, %s]';
            self.log.warn(message, key, oldVal, newVal);
            return;
        }

        //please see notes in the StorageEvent jsdoc about using custom vs native event implementations
        var storageEvent = new StorageEvent('storage');
        storageEvent.initStorageEvent('storage', false, false, key, oldVal, newVal, self._prefix, self);

        process.nextTick(function() {
            if(self.log.level() <= bunyan.DEBUG) {
                self.log.debug('Sending StorageEvent [%s] ', storageEvent);
            }
            eventTarget.dispatchEvent(storageEvent);
        });
    });


};

module.exports = WebStorageDecorator;

}).call(this,require('_process'))
},{"../../core/widget-error":95,"../../core/widget-storage":99,"../../util/logger-factory":121,"../../util/util":123,"./storage-event":117,"_process":126,"browser-bunyan":1}],119:[function(require,module,exports){
(function (global){
'use strict';

var XMLHttpRequest = global.XMLHttpRequest; // jshint ignore:line
var Response = global.Response; // jshint ignore:line

module.exports = function fetchFile(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(new Response(xhr.responseText, {
                status: xhr.status
            }));
        };
        xhr.onerror = function() {
            reject(new Error('Local request failed for ' + url));
        };
        xhr.open('GET', url);
        xhr.send(null);
    });
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],120:[function(require,module,exports){
(function (global){
'use strict';

var RTL_LOCALES = ['ar', 'iw', 'he', 'dv', 'ha', 'fa', 'ps', 'ur', 'yi', 'ji'];

module.exports = {
    defaultLocale: 'en',
    
    intlSupported: typeof global.Intl !== 'undefined',

    /**
     * Returns direction for the given locale (rtl or ltr)
     * @param {String} locale
     * @returns {string}
     */
    getDirection: function (locale) {
        return locale.length >= 2 && RTL_LOCALES.indexOf(locale.substr(0, 2)) >= 0 ? 'rtl' : 'ltr';
    },

    /**
     * Returns best matching locale in available locales considering
     * desired one.
     * @param {String[]} availableLocales
     * @param {String} desiredLocale
     * @returns {String|undefined}
     */
    chooseBestLocale: function (availableLocales, desiredLocale) {
        // 1. Let candidate be locale
        var candidate = desiredLocale;

        // 2. Repeat
        while (candidate) {
            // a. If availableLocales contains an element equal to candidate, then return
            // candidate.
            if (Array.prototype.indexOf.call(availableLocales, candidate) > -1) {
                return candidate;
            }

            // b. Let pos be the character index of the last occurrence of "-"
            // (U+002D) within candidate. If that character does not occur, return
            // undefined.
            var pos = candidate.lastIndexOf('-');

            if (pos < 0) {
                return;
            }

            // c. If pos ≥ 2 and the character "-" occurs at index pos-2 of candidate,
            //    then decrease pos by 2.
            if (pos >= 2 && candidate.charAt(pos - 2) === '-') {
                pos -= 2;
            }

            // d. Let candidate be the substring of candidate from position 0, inclusive,
            //    to position pos, exclusive.
            candidate = candidate.substring(0, pos);
        }
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],121:[function(require,module,exports){
/**
 * Tne Logger Factory
 * @module util/logger-factory
 * @exports {loggerFactory} The static logger factory
 */


'use strict';

var bunyan = require('browser-bunyan');
var util = require('../util/util');

var loggerMap = {};
var lastLogger = null;

var loggerFactory = {
    defaultLoggerName: 'logger',
    defaultLogLevel: 'info'
};

/**
 * Creates a logger.
 * @static
 * @method
 * @param {Object} opts
 * @param {Object} [opts.parentLog] Specifies a parent logger for a logger to be created as a child logger
 * @param {string} [opts.loggerName] A logger name. If not specified a logger will be given "<i>logger</i>" name.
 * @param {string} [opts.logLevel] The default log level. Defaults to 'info'.
 * @param {boolean} [opts.appendId] If true, a unique string will be appended to a logger name. Defaults to <i>false</i>
 * @returns {Object} A new logger object
 */
loggerFactory.createLogger = function(opts) {

    opts = opts || {};

    var parentLog = opts.parentLog || null;
    var loggerName = opts.loggerName || this.defaultLoggerName;
    var logLevel = opts.logLevel || this.defaultLogLevel;
    var appendId = opts.appendId || false;

    if(appendId) {
        loggerName += '/' + util.randomId();
    }

    var logger;
    if(parentLog) {
        logger = parentLog.child({ childName: loggerName});
    } else {
        logger = bunyan.createLogger({
            name: loggerName,
            streams: [
                {
                    level: logLevel,
                    stream: new bunyan.ConsoleFormattedStream(),
                    type: 'raw'
                }
            ]
        });
    }

    loggerMap[loggerName] = logger;
    lastLogger = logger;

    return logger;
};

/**
 * Gets a logger, first tries to get a logger with the matching name. If no logger name is given or no matching
 * logger is found, get the last created logger. Falls back to creating a new logger.
 * @static
 * @method
 * @param {String} [loggerName]
 * @returns {*}
 */
loggerFactory.getLogger = function(loggerName) {

    if(loggerName && loggerMap[loggerName]) {
        return loggerMap[loggerName];
    } else if(lastLogger) {
        return lastLogger;
    } else {
        return loggerFactory.createLogger();
    }
};

module.exports = loggerFactory;
},{"../util/util":123,"browser-bunyan":1}],122:[function(require,module,exports){
'use strict';

var util = require('../util/util');

module.exports = ModelExpressionInterpreter;

/**
 * Used by ProcessingWidgetRenderer to replace model expressions
 * with their corresponding values in the parsed item model.
 * @param {Object<string, *>} context
 * @constructor
 */
function ModelExpressionInterpreter(context) {
    this._context = context;
}

/**
 * It replaces model expressions within the source with their
 * corresponding values in the given context.
 * @param {String} source
 */
ModelExpressionInterpreter.prototype.run = function (source) {
    var tokenizer = /\$\{([^}\s]+)}/g;
    var self = this;

    return source.replace(tokenizer, function (token, content) {
        return util.objectGet(self._context, content);
    });
};

},{"../util/util":123}],123:[function(require,module,exports){
/**
 * Common utilities
 * @module util/util
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var bunyan = require('browser-bunyan');

//super stripped down lodash. Only what we need
var _ = {
    isArray: require('lodash/lang/isArray'),
    cloneDeep: require('lodash/lang/cloneDeep'),
    merge: require('lodash/object/merge'),
    startsWith: require('lodash/string/startsWith'),
    endsWith: require('lodash/string/endsWith'),
    omit: require('lodash/object/omit'),
    assign: require('lodash/object/assign')
};

//widget engine utils.
//If available, delegate a util method in this modele to a lodash one. Only require the specific lodash module required
var util = {};

/**
 * <p>Returns true if:
 * <ol>
 *  <li>the value is a boolean and true<br>
 *  <li>the value is a number and not 0<br>
 *  <li>the value is a string and equal to 'true' (after trimming and ignoring case)
 * </ol>
 * @memberOf util
 * @param {*} val The value to parse
 * @return {boolean} A boolean value depending on the parsing result
 */
/* jshint ignore:start */
util.parseBoolean = function (val) {

    //double equals (==) here is deliberate
    return ((typeof val === 'boolean' || val instanceof Boolean) && val == true) ||
        ((typeof val === 'string' || val instanceof String) && /^\s*true\s*$/i.test(val)) ||
        ((typeof val === 'number' || val instanceof Number) && val != 0);
};
/* jshint ignore:end */

/**
 * Determines if an http(s) url is absolute.
 * @param {string} url
 * @returns {boolean} true if the url is absolute
 */
util.isUrlAbsolute = function (url) {
    var absoluteRegex = /^https?:\/\/|file?:\/\//i;
    return absoluteRegex.test(url);
};

/**
 * Determines if a url is site relative (/path/to/page)
 * @param {string} url
 * @returns {boolean} true if the url is site relative
 */
util.isUrlSiteRelative = function (url) {
    return url.indexOf('/') === 0;
};

/**
 * Determines if a url is document relative (path/to/page or ../path/to/page)
 * @param {string} url
 * @returns {boolean}
 */
util.isUrlDocumentRelative = function (url) {
    return !(util.isUrlAbsolute(url) || util.isUrlSiteRelative(url));
};

/**
 * Determines if a path uses the file protocol. 
 * @param url
 * @return {boolean}
 */
util.isUrlForFile = function(url) {
    return /^file:/.test(url);
};

/**
 * Merges objects
 * @see {@link https://lodash.com/docs#merge}
 */
util.merge = _.merge;

/**
 * Assigns object fields
 * @see {@link https://lodash.com/docs#assign}
 */
util.assign = _.assign;

/**
 * Omit properties from an object
 * @see {@link https://lodash.com/docs#omit}
 */
util.omit = _.omit;

/**
 * Checks if string starts with the given target string.
 * @see {@link https://lodash.com/docs#startsWith}
 */
util.startsWith = _.startsWith;

/**
 * Checks if string ends with the given target string.
 * @see {@link https://lodash.com/docs#endsWith}
 */
util.endsWith = _.endsWith;

/**
 * Creates a deep clone of value.
 * @see {@link https://lodash.com/docs#cloneDeep}
 */
util.cloneDeep = function () {
    try {
        return _.cloneDeep.apply(_, Array.prototype.slice.call(arguments));
    } catch (e) {
        console.warn(e);
        throw e;
    }
};

/**
 * Checks if value is classified as an Array object.
 * @see {@link https://lodash.com/docs#isArray}
 */
util.isArray = _.isArray;

/**
 * Returns a formatted string using the first argument as a printf-like format.
 * @see {@link https://nodejs.org/api/util.html#util_util_format_format}
 */
util.format = function (f) {

    //This code is adapted from node's util.format, with support for objects removed
    //See https://github.com/joyent/node/blob/master/lib/util.js
    //
    //This code exists because at the time of writing, it is the only function from node util that we need and
    //I'm trying to keep the browserified package size down. PM

    if (f === null) {
        return 'null';
    }

    if (typeof f !== 'string') {
        return f.toString();
    }

    //ignored by jshint, because i wanted to modify this from the original code as little as possible
    /* jshint ignore:start */

    var formatRegExp = /%[sdj%]/g;

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function (x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
            case '%s':
                return String(args[i++]);
            case '%d':
                return Number(args[i++]);
            case '%j':
                try {
                    return JSON.stringify(args[i++]);
                } catch (_) {
                    return '[Circular]';
                }
            default:
                return x;
        }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
        str += ' ' + x;
    }
    return str;

    /* jshint ignore:end */
};

/**
 * Given a locale, returns its descendant parts. E.g
 *
 * @param {string} locale
 * @returns {Array}
 */
util.getDescendantLocales = function (locale) {

    //normalize to lowercase
    locale = locale.toLowerCase();

    var descendantLocales = [];
    var parts = locale.split('-');
    var part;
    while (part = parts.shift()) { // jshint ignore:line
        var previousDescendant = descendantLocales[descendantLocales.length - 1];
        descendantLocales.push((previousDescendant ? previousDescendant + '-' : '') + part);
    }

    return descendantLocales;
};

/**
 * Generates a random id
 * @returns {string} The generated id
 */
util.randomId = function () {
    return Math.random().toString(36).substring(7);
};

/**
 * Replaces placeholders in a string using the configVar map.
 * @param   {String} path The path to replace using the config vars
 * @param   {Object} varMap Dictionary object which contains portal data
 * @param   {Object} log Logger instance
 * @returns {String} The updatedp path
 * @private
 */
util.replacePathVars = function (path, varMap, log) {
    for (var urlVar in varMap) {
        if (varMap.hasOwnProperty(urlVar)) {
            var varRegexp = new RegExp('\\$\\(' + urlVar + '\\)', 'g');

            if (log.level() <= bunyan.DEBUG && varRegexp.test(path)) {
                log.debug('Updating resource url. Replacing %s for %s in [%s]', varRegexp, varMap[urlVar], path);
            }

            path = path.replace(varRegexp, varMap[urlVar]);
        }
    }

    return path;
};

util.makeEventTarget = function (obj) {

    Object.defineProperty(obj, '@@', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: new EventEmitter()
    });
    obj.addEventListener = function () {
        this['@@'].on.apply(this['@@'], Array.prototype.slice.call(arguments));
    };
    obj.removeEventListener = function () {
        this['@@'].off.apply(this['@@'], Array.prototype.slice.call(arguments));
    };
    obj.dispatchEvent = function (ev) {
        this['@@'].emit.call(this['@@'], ev.type, ev);
    };
    return obj;
};

util.objectGet = function (obj, path) {
    var fields = typeof path === 'string' ? path.split('.') : path;
    var index = 0;
    var value = obj;
    var length = fields.length;

    while (value != null && index < length) { // jshint ignore:line
        value = value[fields[index++]];
    }

    return (index && index === length) ? value : undefined;
};

module.exports = util;

},{"browser-bunyan":1,"events":125,"lodash/lang/cloneDeep":70,"lodash/lang/isArray":72,"lodash/object/assign":79,"lodash/object/merge":82,"lodash/object/omit":83,"lodash/string/endsWith":84,"lodash/string/startsWith":85}],124:[function(require,module,exports){

},{}],125:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],126:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],127:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],128:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],129:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],130:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":128,"./encode":129}],131:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

},{"punycode":127,"querystring":130}],132:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],133:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3,"handlebars/dist/handlebars.min":134}],134:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],135:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],136:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],137:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],138:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],139:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./createBaseFor":146,"dup":40}],140:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"../object/keysIn":165,"./baseFor":139,"dup":41}],141:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"../lang/isArray":157,"../lang/isObject":160,"../lang/isTypedArray":162,"../object/keys":164,"./arrayEach":137,"./baseMergeDeep":142,"./isArrayLike":149,"./isObjectLike":153,"dup":44}],142:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"../lang/isArguments":156,"../lang/isArray":157,"../lang/isPlainObject":161,"../lang/isTypedArray":162,"../lang/toPlainObject":163,"./arrayCopy":136,"./isArrayLike":149,"dup":45}],143:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],144:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"../utility/identity":167,"dup":48}],145:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"../function/restParam":135,"./bindCallback":144,"./isIterateeCall":151,"dup":52}],146:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./toObject":155,"dup":53}],147:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./baseProperty":143,"dup":55}],148:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"../lang/isNative":159,"dup":56}],149:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"./getLength":147,"./isLength":152,"dup":61}],150:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"dup":62}],151:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"../lang/isObject":160,"./isArrayLike":149,"./isIndex":150,"dup":63}],152:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],153:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],154:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"../lang/isArguments":156,"../lang/isArray":157,"../object/keysIn":165,"./isIndex":150,"./isLength":152,"dup":68}],155:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"../lang/isObject":160,"dup":69}],156:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"../internal/isArrayLike":149,"../internal/isObjectLike":153,"dup":71}],157:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"../internal/getNative":148,"../internal/isLength":152,"../internal/isObjectLike":153,"dup":72}],158:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"./isObject":160,"dup":73}],159:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"../internal/isObjectLike":153,"./isFunction":158,"dup":74}],160:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],161:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../internal/baseForIn":140,"../internal/isObjectLike":153,"./isArguments":156,"dup":76}],162:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"../internal/isLength":152,"../internal/isObjectLike":153,"dup":77}],163:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"../internal/baseCopy":138,"../object/keysIn":165,"dup":78}],164:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"../internal/getNative":148,"../internal/isArrayLike":149,"../internal/shimKeys":154,"../lang/isObject":160,"dup":80}],165:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../internal/isIndex":150,"../internal/isLength":152,"../lang/isArguments":156,"../lang/isArray":157,"../lang/isObject":160,"dup":81}],166:[function(require,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"../internal/baseMerge":141,"../internal/createAssigner":145,"dup":82}],167:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"dup":86}],168:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],169:[function(require,module,exports){
/**
 * A central CXP configuration object to be used across multiple web APIs
 * @exports a new CxpConfiguration instance
 * @module configuration/index
 */

'use strict';

var cxpUtil = require('./cxp-util');
var bunyan = require('browser-bunyan');

/**
 * Constructs a new CXP Configuration object
 * @param {Object} [opts] A set of configuration options
 * @param {string} [opts.contextRoot] Set the context root via the constructor
 * @param {string} [opts.remoteContextRoot] Set the remote context root via the constructor
 * @param {Object} [opts.log] Provide a completely new logger. This should be a 'browser-bunyan' logger.
 *                            Internally, a new child logger will be created, using the supplied logger as a parent
 * @param {Array} [opts.logStreams] Provide custom log streams to use with the internally generated logger.
 *                                  This will be ignored if your provide your own logger
 * @param {string} [opts.logLevel] Set the logging level. This will be ignored if you provide your own logger.
 * @constructor
 */
var CxpConfiguration = function(opts) {

    opts = opts || {};

    var loggerName = 'cxp-web';
    this.log = opts.log ? opts.log.child({ childName: loggerName}) : bunyan.createLogger({
        name: loggerName || 'logger',
        streams: Array.isArray(opts.logStreams) ? opts.logStreams : [
            {
                level: opts.logLevel || 'info',
                stream: new bunyan.ConsoleFormattedStream(),
                type: 'raw'
            }
        ]
    });

    this.settings = {};

    //expected opts
    if(opts.contextRoot) {
        this.set('contextRoot', opts.contextRoot);
    }
    if(opts.remoteContextRoot) {
        this.set('remoteContextRoot', opts.remoteContextRoot);
    }
};

/**
 * Exposes CXP util via the config object
 * @member util
 * @type {*|exports}
 */
CxpConfiguration.prototype.util = cxpUtil;

/**
 * Sets a value
 * @param {string} name
 * @param {*} value
 */
CxpConfiguration.prototype.set = function(name, value) {
    this.settings[name] = value;
};

/**
 * Gets a value
 * @param {string} name
 * @returns {*}
 */
CxpConfiguration.prototype.get = function(name) {
    return this.settings[name];
};

/**
 * Enables a boolean value
 * @param {string} name
 */
CxpConfiguration.prototype.enable = function(name) {
    this.settings[name] = true;
};

/**
 * Disables a boolean value
 * @param {string} name
 */
CxpConfiguration.prototype.disable = function(name) {
    this.settings[name] = false;
};

/**
 * Checks if a boolean value is true
 * @param {string} name
 * @returns {boolean}
 */
CxpConfiguration.prototype.enabled = function(name) {
    return this.settings[name];
};

/**
 * Checks if a boolean value is false
 * @param {string} name
 * @returns {boolean}
 */
CxpConfiguration.prototype.disabled = function(name) {
    return !this.settings[name];
};

/**
 * Gets a logger stored internally
 * @returns {CxpConfiguration.log}
 */
CxpConfiguration.prototype.getLogger = function() {
    return this.log;
};

function createConfiguration (cxpOptions) {
    return new CxpConfiguration(cxpOptions);
}

module.exports = {
    Configuration: CxpConfiguration,
    createInstance: createConfiguration
};

},{"./cxp-util":170,"browser-bunyan":132}],170:[function(require,module,exports){
/**
 * A general utility class for working with CXP related things
 * @module cxp-configuration/util
 * @type {{getPreference: getPreference, getPreferenceValue: getPreferenceValue}}
 */

'use strict';

module.exports = {

    /**
     * Given an item, returns a preference object with a matching name
     * @param {Object} item A CXP item model
     * @param {string} name The name of the preference
     * @returns {Object} The preference object, containing name and value fields
     */
    getPreference: function(item, name) {
        if(item.preferences) {
            return item.preferences.filter(function(pref) {
                return pref.name === name;
            })[0] || null;
        }
    },

    /**
     * Given an item, returns the value the preference with the specified name
     * @param {Object} item A CXP item model
     * @param {string} name The name of the preference
     * @returns {string} The preference value
     */
    getPreferenceValue: function(item, name) {
        var pref = this.getPreference(item, name);
        return pref ? pref.value : null;
    }
};


},{}],171:[function(require,module,exports){
'use strict';

var render = require('./render/render.js');
var configuration = require('./configuration/configuration.js');
var xmlCxpModel = require('./model/strategies/xml-cxp-model');

module.exports = {
    // Factory methods
    getRenderer: render.createInstance,
    createConfiguration: configuration.createInstance,
    getModel: xmlCxpModel.createInstance
};
},{"./configuration/configuration.js":169,"./model/strategies/xml-cxp-model":191,"./render/render.js":194}],172:[function(require,module,exports){
'use strict';

/**
 * ItemCollectionContext
 * @module model/core/item-collection-context
 * @exports {ItemCollectionContext}
 */
module.exports = ItemCollectionContext;

/**
 * ItemCollectionContext represents a collection of items.
 * It's responsibility to manipulate items in the given context
 * like creating new items, filtering them.
 * @param {Configuration} config Cxp configuration
 * @param {String} type Item type
 * @param [Object] filters Optional filter
 * @constructor
 * @interface
 */
function ItemCollectionContext (config, cache, type, filter) {
    this.config = config;
    this.type = type;
    this._filter = filter || null;
    this._requiredParams = this._getRequiredParams();
    this._cache = cache;

    this.logger = this.config.getLogger().child({
        childName: 'item-collection-context'
    });
}

/**
 * Returns required params for certain types
 * @private
 * @returns {Object} Required params as key/value
 */
ItemCollectionContext.prototype._getRequiredParams = function () {
    switch (this.type) {
        case 'link':
            return {depth: 10, ps: 50};
        case 'page':
            return {depth: 10};
        
        default:
            return null;
    }
};

/**
 * Gets array of all item objects of the given type in the current context
 * @returns {Promise} Promise of array of items
 */
ItemCollectionContext.prototype.get = function () {
    throw new Error('Method not implemented');
};

/**
 * Creates a new item using the given item model
 * @param {Object} itemModel Item model
 */
ItemCollectionContext.prototype.create = function (itemModel) {
    throw new Error('Method not implemented');
};

/**
* Applies a filter to the itemContext which will applied to future get() calls
* @param {String} name
* @param {String} value
* @param {string} operator One of 'lt', 'gt', 'eq', 'not', 'like'
* @return {ItemCollectionContext}
 */
ItemCollectionContext.prototype.filter = function (name, value, operator) {
    throw new Error('Method not implemented');
};

},{}],173:[function(require,module,exports){
'use strict';

/**
 * ItemContext
 * @module model/core/item-context
 * @exports {ItemContext}
 */
module.exports = ItemContext;

/**
 * ItemContext for the item identified by the given name
 * @param {Configuration} config CXP Configuration
 * @param {String} itemName Item name
 * @param {String} itemType Type of the item
 * @param {Bool} findById
 * @constructor
 * @interface
 */
function ItemContext(config, cache, itemName, itemType, findById) {
    this.config = config;
    this.itemName = itemName;
    this.itemType = itemType;
    this.findById = findById || false;
    this._requiredParams = this._getRequiredParams() || {};
    this._cache = cache;

    this.logger = this.config.getLogger().child({
        childName: 'item-collection-context'
    });
}

/**
 * Returns required params for certain types
 * @private
 * @returns {Object} Required params as key/value
 */
ItemContext.prototype._getRequiredParams = function () {
    switch (this.itemType) {
        case 'link':
        case 'page':
            return {depth: 10};

        default:
            return null;
    }
};

/**
 * The plain model object of the item
 * @param {Bool} force Force to reload resource
 * @returns {Promise}
 */
ItemContext.prototype.get = function (force) {
    throw new Error('Method not implemented');
};

/**
 * Updates the item using the given item model
 * @param {Object} model New item model
 * @returns {Promise} Updated model object
 */
ItemContext.prototype.update = function (model) {
    throw new Error('Method not implemented');
};

/**
 * Reverts item's customizations.
 * @returns {Promise}
 */
ItemContext.prototype.revert = function () {
    throw new Error('Method not implemented');
};

/**
 * Removes the item
 * @returns {Promise}
 */
ItemContext.prototype.remove = function () {
    throw new Error('Method not implemented');
};


},{}],174:[function(require,module,exports){
'use strict';

var BIDI_DIRECTIONS = ['ar', 'iw', 'he', 'dv', 'ha', 'fa', 'ps', 'ur', 'yi', 'ji'];

module.exports = {
    defaultLocale: 'en',
    getDirection: function (locale) {
        return BIDI_DIRECTIONS.indexOf(locale) >= 0 ? 'rtl' : 'ltr';
    }
};

},{}],175:[function(require,module,exports){
'use strict';

/**
 * @module model/core/ModelCache
 */
module.exports = ModelCache;

function ModelCache () {
    this.items = {};
}

ModelCache.prototype.update = function (itemType, key, value) {
    if (!this.items[itemType]) {
        this.items[itemType] = {};
    }

    this.items[itemType][key] = value;
};

ModelCache.prototype.get = function (itemType, key) {
    return this.items[itemType] && this.items[itemType][key];
};

ModelCache.prototype.remove = function (itemType, key) {
    if (!this.items[itemType] || !this.items[itemType][key]) {
        return null;
    }

    var item = this.items[itemType][key];
    delete this.items[itemType][key];

    return item;
};

},{}],176:[function(require,module,exports){
'use strict';

/**
 * ModelHelpers module provides helper functions
 * for manipulating/exploring item model
 * @module model/core/ModelHelpers
 */
module.exports = {
    modifyPreference: modifyPreference,
    getPreference: getPreference,
    generateItemName: generateItemName
};

/**
 * Changes preference's value with given one.
 * Throws error if preference not found.
 *
 * @param {Object} model Item model
 * @param {String} name Preference name
 * @param {String} [valueType] Type of the preference value
 * @param {Any} value New value for preference
 */
function modifyPreference(model, name, value, valueType) {
    var type = valueType || (name === 'order' ? 'double' : 'string');
    var preference = getPreference(model, name);

    if (preference) {
        preference.value = value;
        if (preference.type !== type) {
            preference.type = type;
        }
    } else {
        model.preferences.push({name: name, value: value, 'type': type});
    }
}

/**
 * Finds preference in the item model with
 * given name.
 *
 * @param {Object} model Item model
 * @param {String} name Preference name
 *
 * @returns {Object|undefined}
 */
function getPreference(model, name) {
    return model.preferences.filter(function (preference) {
        return preference.name === name;
    })[0];
}

/**
 * Performance optimized UUID generation code
 *
 * @returns {String} uuid
 */
var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); } // jshint ignore:line
function generateUUID () {
    /* jshint ignore:start */
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    /* jshint ignore:end */
}

/**
 * Generates new item name based on extendedItemName
 * and random generated UUID
 *
 * @param {String} extendedItemName Extended item's name
 * @returns {String} New item name
 */
function generateItemName(extendedItemName) {
    return extendedItemName + generateUUID();
}

},{}],177:[function(require,module,exports){
'use strict';

var modelHelpers = require('../core/model-helpers');
var ModelCache = require('../core/model-cache');

/**
 * Model Api
 * @module model/core/model
 * @exports {Model} The constructor
 */
module.exports = Model;

/**
 * Model gets portal data
 * @param {CxpConfiguration} configuration
 * @constructor
 * @interface
 */
function Model (configuration) {
    this.config = configuration;
    this.helpers = modelHelpers;
    this._cache = new ModelCache();
}

/**
 * Gets items of the given type for the current context
 *
 * @param {String} itemType Type of item
 * @returns {ItemCollectionContext}
 */
Model.prototype.items = function (itemType) {
    throw new Error('Method not implemented');
};

/**
 * ItemContext for the item identified by the given name
 *
 * @param {String} itemName Name of item
 * @param {String} itemType Type of item
 * @returns {ItemContext}
 */
Model.prototype.item = function (itemName, itemType) {
    throw new Error('Method not implemented');
};

/**
 * ItemContext for the item identified by the given id
 *
 * @param {String} itemId Id of item
 * @param {String} itemType Type of item
 * @returns {ItemContext}
 */
Model.prototype.itemById = function (itemId, itemType) {
    throw new Error('Method not implemented');
};

},{"../core/model-cache":175,"../core/model-helpers":176}],178:[function(require,module,exports){
(function (global){
'use strict';

var fetch = global.fetch;
var _ = require('../../util')._;

/**
 * Manages outgoing AJAX calls
 * @module model/rest-api-consumer
 * @exports {RestApiConsumer} Exports the constructor
 * @exports {createInstance} Exports the factory method
 */
module.exports = {
    RestApiConsumer: RestApiConsumer,
    createInstance: createInstance
};

/**
 * RestApiConsumer responsible for making rest calls, caching?, authentication?
 * @param {Configuration} configuration
 * @constructor
 */
function RestApiConsumer (configuration) {
    this.configuration = configuration;

    var baseUrl = configuration.get('remoteContextRoot');
    if (typeof baseUrl !== 'string') {
        throw new Error('RestApiConsumer needs remoteContextRoot variable to be set');
    }

    // Make sure baseUrl ends with "/"
    if (/\/$/.test(baseUrl) === false) {
        baseUrl += '/';
    }

    this.baseUrl = baseUrl;

    this.logger = configuration.getLogger().child({
        childName: 'rest-api-consumer'
    });
}

/**
 * Encodes given object as query parameters
 * @param {Object} params
 * @returns {String} Encoded parameters
 * @private
 */
RestApiConsumer.prototype._encodeQueryParameters = function (params) {
    var query = [];

    Object.keys(params).forEach(function (key) {
        if (_.isArray(params[key])) {
            params[key].forEach(function (value) {
                query.push(key + '[]=' + encodeURIComponent(value));
            });
        } else {
            query.push(key + '=' + encodeURIComponent(params[key]));
        }
    });

    return query.join('&');
};

/**
 * Builds full url for given endpoint and parameters
 * @param {String} endpoint
 * @param {Object} [params]
 * @returns {string}
 * @private
 */
RestApiConsumer.prototype._buildUrl = function (endpoint, params) {
    var query = this._encodeQueryParameters(params || {});
    var url = this.baseUrl + endpoint;

    if (query.length > 0) {
        url += (endpoint.indexOf('?') >= 0 ? '&' : '?') + query;
    }

    return url;
};

/**
 * Makes ajax request and manage request's lifecycle.
 * @param {String} endpoint Endpoint url
 * @param {Object} [params] Query parameters
 * @param {Object} options Fetch options
 * @returns {Promise}
 * @private
 */
RestApiConsumer.prototype._makeRequest = function (endpoint, params, options) {
    var self = this;
    var requestUrl = this._buildUrl(endpoint, params);

    options = options || {};
    options.credentials = options.credentials || 'same-origin';

    this.logger.debug('Making %s request to: %s', options.method, requestUrl);

    var promise =  fetch(requestUrl, options)
        .then(function (response) {
            if (response.status < 200 || response.status >= 300) {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }

            self.logger.debug('Request successful server responds %s', response.status);
            return response;
        });

    promise.catch(function (err) {
        self.logger.error('Request failed with: %s', err);
    });

    return promise;
};

/**
 * Makes a GET request to given endpoint
 * @param {String} endpoint
 * @param {Object} [params] Query params
 * @returns {Promise}
 */
RestApiConsumer.prototype.get = function (endpoint, params) {
    return this._makeRequest(endpoint, params, {
        method: 'GET',
        headers: {
            // this is to prevent IE/Edge from caching of REST endpoint responses
            'Pragma' : 'no-cache',
            'Cache-Control' : 'no-cache'
        }
    });
};

/**
 * Makes a POST request to given endpoint
 * @param {String} endpoint
 * @param {Object} data Request body
 * @returns {Promise}
 */
RestApiConsumer.prototype.post = function (endpoint, data) {
    var headers = {};

    if (_.isObject(data)) {
        data = JSON.stringify(data);
    }

    var mimeType = determineContentType(data);
    if (mimeType) {
        headers['Content-Type'] = mimeType;
    }

    //sending a token here is redundant unless the content type is x-www-url-form-encoded or multipart/form-data,
    //but it gives people piece of mind.
    var csrfToken = getCsrfToken(this.configuration);
    if(csrfToken) {
        headers[csrfToken.name] = csrfToken.value;
    }

    return this._makeRequest(endpoint, {}, {
        method: 'POST',
        body: data,
        headers: headers
    });
};

/**
 * Makes a PUT request to given endpoint
 * @param {String} endpoint
 * @param {Object} data Request body
 * @returns {Promise}
 */
RestApiConsumer.prototype.put = function (endpoint, data) {
    var headers = {};

    if (_.isObject(data)) {
        data = JSON.stringify(data);
    }

    var mimeType = determineContentType(data);
    if (mimeType) {
        headers['Content-Type'] = mimeType;
    }

    //sending a token here is redundant, but it gives people piece of mind
    var csrfToken = getCsrfToken(this.configuration);
    if(csrfToken) {
        headers[csrfToken.name] = csrfToken.value;
    }

    return this._makeRequest(endpoint, {}, {
        method: 'PUT',
        body: data || '',
        headers: headers
    });
};

/**
 * Makes a DELETE request to given endpoint
 * @param {String} endpoint
 * @param {Object} params Query params
 * @returns {Promise}
 */
RestApiConsumer.prototype.delete = function (endpoint, params) {

    var headers = {};

    //sending a token here is redundant, but it gives people piece of mind
    var csrfToken = getCsrfToken(this.configuration);
    if(csrfToken) {
        headers[csrfToken.name] = csrfToken.value;
    }

    return this._makeRequest(endpoint, params, {
        method: 'DELETE',
        headers: headers
    });
};

/**
 * Returns an instance of RestApiConsumer
 * @param opts
 * @param opts.baseUrl Base url for api endpoints
 * @param opts.concurrentLimit Maximum number of concurrent ajax calls
 * @returns {RestApiConsumer}
 */
function createInstance (opts) {
    return new RestApiConsumer(opts);
}

/**
 * Finds the best Content-Type header value for the given data
 * @param {Object|String} data
 * @returns {String} Mime type
 */
function determineContentType (data) {
    if (_.isObject(data)) {
        return 'application/json';
    } else if (data && data.indexOf('<?xml') >= 0) {
        return 'text/xml';
    } else {
        return 'application/xml';
    }
}

function getCsrfToken(config) {
    return config.get('csrfToken') || null;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../util":196}],179:[function(require,module,exports){
'use strict';

var XmlBuilder = require('./xml-builder');

module.exports = function (preferences) {
    var xml = new XmlBuilder();

    xml.beginElement('widget');
    xml.beginElement('properties');

    preferences.forEach(function (preference) {
        var attrs = {
            name: preference.name,
        };
        
        if (preference.label) {
            attrs.label = preference.label;
        }

        if (typeof preference.localizable === 'boolean') {
            attrs.localizable = preference.localizable;
        }

        if (preference.viewhints && preference.viewhints.length > 0) {
            attrs.viewHint = preference.viewhints.join(',');
        }

        xml.beginElement('property', attrs);
        xml.beginElement('value');
        xml.text(preference.value);
        xml.endElement('value');
        xml.endElement('property');
    });

    xml.endElement('properties');
    xml.endElement('widget');

    return xml.toString();
};

},{"./xml-builder":181}],180:[function(require,module,exports){
'use strict';

var XmlBuilder = require('./xml-builder');

/**
 * Generates xml for given widget model
 * @param {Object} model Widget model
 * @param {Boolean} [isContainer]
 * @returns {String} Widget xml
 */
module.exports = function (model, isContainer) {
    isContainer = isContainer || false;

    var xml = new XmlBuilder();

    xml.beginElement(isContainer ? 'container' : 'widget');
    // inner widget

    // name
    if (model.name) {
        xml.beginElement('name');
        xml.text(model.name);
        xml.endElement('name');
    }

    // contextItemName
    if (model.contextItemName) {
        xml.beginElement('contextItemName');
        xml.text(model.contextItemName);
        xml.endElement('contextItemName');
    }

    // extendedItemName
    if (model.extendedItemName) {
        xml.beginElement('extendedItemName');
        xml.text(model.extendedItemName);
        xml.endElement('extendedItemName');
    }

    // parentItemName
    if (model.parentItemName) {
        xml.beginElement('parentItemName');
        xml.text(model.parentItemName);
        xml.endElement('parentItemName');
    }

    // manageable
    if (typeof model.manageable === 'boolean') {
        xml.beginElement('manageable');
        xml.text(model.manageable ? 'true' : 'false');
        xml.endElement('manageable');
    }

    // properties
    xml.beginElement('properties');
    generateProperties(xml, model, isContainer);
    xml.endElement('properties');

    // tags
    if (model.tags && model.tags.length > 0) {
        xml.beginElement('tags');
        model.tags.forEach(function (tag) {
            xml.beginElement('tag', { type: tag.type });
            xml.text(tag.name);
            xml.endElement('tag');
        });
        xml.endElement('tags');
    }

    // uuid
    if (model.id) {
        xml.beginElement('uuid');
        xml.text(model.id);
        xml.endElement('uuid');
    }

    // end of widget
    xml.endElement(isContainer ? 'container' : 'widget');

    return xml.toString();
};

/**
 * Generates widget properties for given model
 * @param {XmlBuilder} xml
 * @param {Object} model
 */
function generateProperties(xml, model, isContainer) {
    // widgetChrome
    generateProperty(xml, { name: 'widgetChrome', readonly: false, value: '$(contextRoot)/static/backbase.com.2012.aurora/html/chromes/widget_none.html', viewhints: ['select-one', 'designModeOnly', 'user'] });

    // src
    if (model.content && model.content.src) {
        generateProperty(xml, { name: 'src', readonly: false, value: model.content.src });
    }

    // settingsSrc
    if (model.settingsContent && model.settingsContent.src) {
        generateProperty(xml, { name: 'settingsSrc', readonly: false, value: model.settingsContent.src });
    }

    // viewmodes
    if (model.viewmodes && model.viewmodes.length > 0) {
        generateProperty(xml, { name: 'viewmodes', readonly: false, value: model.viewmodes.join(' ') });
    }

    // add top level properties
    var propertyNameMap = { description: 'Description' };
    var properties = ['author', 'authorEmail', 'authorHref', 'license', 'licenseHref', 'shortName', 'description'];

    properties.forEach(function (property) {
        if (model[property]) {
            var propertyName = propertyNameMap[property] || property;
            generateProperty(xml, { name: propertyName, readonly: false, value: model[property] });
        }
    });

    // add icons
    var icons = model.icons || [];
    icons.forEach(function (icon, i) {
        var propertyName = i === 0 ? 'thumbnailUrl' : 'icon';
        generateProperty(xml, { name: propertyName, readonly: false, value: icon });
    });

    // add other properties
    var preferences = model.preferences || [];
    preferences.forEach(function (preference) {
        generateProperty(xml, preference);
    });
}

/**
 * Generates single property element for given property
 * @param {XmlBuilder} xml
 * @param {Object} property
 */
function generateProperty(xml, property) {
    var attrs = {
        name: property.name,
        readonly: property.readonly || false
    };

    if (typeof property.manageable === 'boolean') {
        attrs.manageable = property.manageable;
    }

    if (typeof property.localizable === 'boolean') {
        attrs.localizable = property.localizable;
    }

    if (property.label) {
        attrs.label = property.label;
    }

    if (property.viewhints && property.viewhints.length > 0) {
         attrs.viewHint = property.viewhints.join(',');
    }

    xml.beginElement('property', attrs);

    // value
    var type = property.type || (property.name === 'order' ? 'double' : 'string');
    xml.beginElement('value', {
        type: type
    });
    xml.text(property.value);
    xml.endElement('value');

    xml.endElement('property');
}

},{"./xml-builder":181}],181:[function(require,module,exports){
'use strict';

/**
 * @module model/core/XmlGenerator
 * @export {XmlGenerator}
 */
module.exports = XmlBuilder;

function XmlBuilder () {
    this.xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
}

XmlBuilder.prototype.beginElement = function (tagName, attributes) {
    var attributesString = '';
    if (attributes) {
        attributesString = Object.keys(attributes).reduce(function (str, attrName) {
            return str + ' ' + attrName + '="' + attributes[attrName] + '"';
        }, '');
    }

    this.xml += '<' + tagName + attributesString + '>';
};

XmlBuilder.prototype.endElement = function (tagName) {
    this.xml += '</' + tagName + '>';
};

XmlBuilder.prototype.text = function (text) {
    this.xml += text;
};

XmlBuilder.prototype.toString = function () {
    return this.xml;
};

},{}],182:[function(require,module,exports){
'use strict';

var generateWidgetPreferences = require('./widget-preferences-generator');
var generateWidget = require('./widget-xml-generator');

module.exports = {
    generate: generate,
    generateWidget: generateWidget,
    generateContainer: generateContainer,
    generateWidgetPreferences: generateWidgetPreferences,
};

function generate(model, type) {
    var methodName = 'generate' + type[0].toUpperCase() + type.substr(1);
    return module.exports[methodName](model);
}

function generateContainer(model) {
    return generateWidget(model, true);
}

},{"./widget-preferences-generator":179,"./widget-xml-generator":180}],183:[function(require,module,exports){
'use strict';

var h = require('./xml/helpers');
var parseWidget = require('./xml/widget');
var parseLink = require('./xml/link');
var parsePage = require('./xml/page');

var loggerFactory = require('backbase-widget-engine/src/util/logger-factory');

/**
 * XML parser
 * @module model/parsers/xml-parser
 * @exports {parseWidget} Widget parser
 * @exports {parseWidgets} Widget collection parser
 * @exports {parsePage} Page parser
 * @exports {parsePages} Page collection parser
 * @exports {parseLink} Link parser
 * @exports {parseLinks} Link collection parser
 * @exports {parseContainer} Container parser
 * @exports {parseContainers} Container collection parser
 */
module.exports = {
    parse:           parse,
    parseWidget:     parseXml(parseWidget),
    parseWidgets:    parseChildrenXml(parseWidget),
    parseLink:       parseXml(parseLink),
    parseLinks:      parseChildrenXml(parseLink),
    parsePage:       parseXml(parsePage),
    parsePages:      parseChildrenXml(parsePage),
    parseContainer:  parseXml(parseWidget),
    parseContainers: parseChildrenXml(parseWidget)
};

/**
 * Parse given string to model object associated with given item type.
 *
 * @param {String} xml
 * @param {String} type Type can be 'link', 'page', 'widget', 'container' type names can be pluralized.
 * @returns {Object}
 */
function parse(xml, type) {
    var methodName = 'parse' + type[0].toUpperCase() + type.substr(1);
    return module.exports[methodName](xml);
}

/**
 * Takes a parser and an xml content and calls parser
 * function with first child of DOMParser's document.
 *
 * @param {function} parse Parser function
 * @return {function} parsed item model
 */
function parseXml (parse) {
    return function (xml) {
        var logger = loggerFactory.createLogger();
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, 'application/xml');
        return parse(findNonXmlTag(doc), logger);
    };
}

/**
 * Takes a parser and an xml content and maps parser
 * function over all children nodes of document's
 * first children.
 *
 * @param {function} parse Parser function
 * @return {function} parsed item model
 */
function parseChildrenXml (parse) {
    return function (xml) {
        var logger = loggerFactory.createLogger();
        var parser = new DOMParser();
        var doc = parser.parseFromString(xml, 'application/xml');
        return h.toArray(findNonXmlTag(doc).children).map(function (item) {
            return parse(item, logger);
        });
    };
}

function findNonXmlTag (doc) {
    var node = doc.firstChild;
    while (node.tagName === 'xml') {
        node = node.nextSibling;
    }

    return node;
}

},{"./xml/helpers":186,"./xml/link":188,"./xml/page":189,"./xml/widget":190,"backbase-widget-engine/src/util/logger-factory":121}],184:[function(require,module,exports){
'use strict';

var h = require('./helpers');

module.exports = {
    parseIcons:      parseIcons,
    childComparator: childComparator
};

/**
 * Extracts icon specific data from given item node and its properties
 * @param {Node} node
 * @param {Object} properties Key/Value representation of properties
 * @return {Array}
 */
function parseIcons (node, properties) {
    var icons = [];
    h.pushIfExists(icons, properties.thumbnailUrl);
    h.pushIfExists(icons, properties.icon);
    return icons;
}

/**
 * Compare function to be used in array.sort like
 * functionality to sort widgets by their area and order
 * @param {Object} firsrt Widget object
 * @param {Object} next Widget object
 * @return {number}
 */
function childComparator (first, next) {
    var firstArea   = h.getProperty(first, 'area');
    var firstAreaF  = h.parseFloat(firstArea);

    var nextArea    = h.getProperty(next, 'area');
    var nextAreaF   = h.parseFloat(nextArea);

    var firstOrder  = h.getProperty(first, 'order');
    var firstOrderF = h.parseFloat(firstOrder);

    var nextOrder   = h.getProperty(first, 'order');
    var nextOrderF  = h.parseFloat(nextOrder);

    var firstValue  = firstAreaF;
    var nextValue   = nextAreaF;

    if (!h.isExists(firstArea) || !h.isExists(nextArea)) {
        firstValue = firstOrderF;
        nextValue = nextOrderF;
    } else if (isNaN(firstOrderF) || isNaN(nextOrderF)) {
        firstValue = firstArea;
        nextValue = nextArea;
    }

    if (firstValue < nextValue) {
        return -1;
    } else if (firstValue > nextValue) {
        return 1;
    } else {
        return 0;
    }
}

},{"./helpers":186}],185:[function(require,module,exports){
module.exports.PROPERTY_BLACKLIST = [
    'Description',
    'shortName',
    'thumbnailUrl',
    'icon',
    'viewmodes',
    'author',
    'authorEmail',
    'authorHref',
    'license',
    'licenseHref',
    'widgetChrome',
    'config',
    'src',
    'settingsSrc',
    'isManageableArea',
    'version'
];

},{}],186:[function(require,module,exports){
'use strict';

module.exports = {
    assignIfExists: assignIfExists,
    content:        content,
    getProperty:    getProperty,
    isExists:       isExists,
    parseBool:      parseBool,
    parseString:    parseString,
    parseFloat:     parseFloat_,
    parseViewhint:  parseViewhint,
    pushIfExists:   pushIfExists,
    toArray:        toArray,
    getChildElementByName: getChildElementByName
};

/**
 * Parses given attribute as string
 * @param {Attribute|{value: string}} string
 * @return {string|undefined}
 */
function parseString (string) {
    if (string && string.value.length) {
        return string.value;
    }
}

/**
 * Parses given viewhint string as array of viewhints
 * @param {string} viewhint Viewhint text
 * @return {Array<string>}
 */
function parseViewhint (viewhint) {
    var viewhintTrimmed = parseString(viewhint);

    if (!viewhintTrimmed) { return []; }

    return viewhintTrimmed.split(/[,\s]/).filter(function (hint) {
        return hint.trim().length > 0;
    });
}

/**
 * Checks given value against undefined and null
 * @param {*} val
 * @return {boolean}
 */
function isExists (val) {
    return typeof val !== 'undefined' && val !== null;
}

/**
 * Assigns given value to given object's name property only
 * if given value is not null or undefined. If converter_function is
 * defined given value is mapped over that function
 * @param {Object} obj  Object
 * @param {string} name Object's property name
 * @param {*} value Value to be assigned
 * @param {Function} [_converter_fun] Optional value transformer function
 */
function assignIfExists (obj, name, value, _converter_fun) {
    if (isExists(value)) {
        obj[name] = _converter_fun ? _converter_fun(value) : value;
    }
}

/**
 * Pushes given value to given array only if the given
 * value is not null or undefined.
 * @param {Array} arr Array
 * @param {*} value Value to be pushed
 */
function pushIfExists (arr, value) {
    if (isExists(value)) {
        arr.push(value);
    }
}

/**
 * Parses string into boolean. Return true only if given
 * string equals to "true" otherwise it returns "false"
 * @param {string} bool
 * @return {boolean}
 */
function parseBool (bool) {
    if (isExists(bool)) {
        if (typeof bool === 'string') {
            return bool === 'true';
        }

        return bool && bool.value === 'true';
    }
}

/**
 * Transforms given array like object (eg dom children)
 * to real array.
 * @param {*} obj
 * @return {Array}
 */
function toArray (obj) {
    return [].slice.call(obj);
}

/**
 * Parses given string into float. If the given string is represents
 * a number it returns undefined.
 * @param {string} num
 * @return {number|undefined}
 */
function parseFloat_ (num) {
    if (typeof num === 'string') {
        return parseFloat(num);
    }
}

/**
 * Finds first element in the given node's children by given element.
 * Unlike getElementsByTagName this function only looks first level of
 * children.
 * @param {Node} node
 * @param {string} elementName
 * @return {Node|undefined}
 */
function getChildElementByName (node, elementName) {
    var children = toArray(node.children);

    for (var i = 0; i < children.length; i++) {
        if (children[i].tagName === elementName) {
            return children[i];
        }
    }
}

/**
 * Returns node's textContent which found by given elementName.
 * If element name is not found in given node's children given
 * default value will be returned.
 * This function only looks first level of children.
 * @param {Element} doc
 * @param {string} elementName
 * @param {*} [defaultValue]
 * @return {string}
 */
function content (doc, elementName, defaultValue) {
    var element = getChildElementByName(doc, elementName);

    if (typeof defaultValue === 'undefined') {
        defaultValue = null;
    }

    return (element && element.textContent) || defaultValue;
}

/**
 * Returns a property value which found by given propertyName
 * @param {Object} item Item object to be searched for property
 * @param {string} propertyName
 * @return {*|undefined}
 */
function getProperty (item, propertyName) {
    var property = item.preferences.filter(function (property) {
        return property.name === propertyName;
    })[0];

    return property && property.value;
}


},{}],187:[function(require,module,exports){
'use strict';

var Constants = require('./constants');
var BLACKLIST = Constants.PROPERTY_BLACKLIST;
var locale = require('../../core/locale');

var h = require('./helpers');

module.exports = parseItem;

/**
 * Extracts base item data from given node. This item
 * data is common between each item type. Other item types
 * uses this item parser to get their base data.
 * @param {Element} node Item node
 * @return {Object} Base item data
 */
function parseItem (node) {
    var propertiesParent = h.getChildElementByName(node, 'properties');
    var propertyElements = h.toArray(propertiesParent.children);

    var currentLocale = h.content(node, 'locale') || locale.defaultLocale;

    var properties = {};
    var propertiesArr = propertyElements.map(function (element) {
        var property = parseProperty(element, currentLocale);
        properties[property.name] = property.value;
        return property;
    }).filter(function (property) {
        return BLACKLIST.indexOf(property.name) === -1;
    });

    var item = {
        id:               h.content(node, 'uuid'),
        name:             h.content(node, 'name', ''),
        shortName:        properties.shortName,
        preferences:      propertiesArr,
        preferencesDict:  properties,
        type:             node.tagName,
        locale:           currentLocale
    };

    h.assignIfExists(item, 'tags', parseTags(node));
    h.assignIfExists(item, 'extendedItemName', h.content(node, 'extendedItemName'));
    h.assignIfExists(item, 'parentItemName', h.content(node, 'parentItemName'));
    h.assignIfExists(item, 'lockState', h.content(node, 'lockState'));
    h.assignIfExists(item, 'securityProfile', h.content(node, 'securityProfile'));

    return item;
}

/**
 * Parses property object from a given property node
 * @param {Element} propertyElement <property ...> node
 * @param {Boolean} currentLocale
 * @return {Object} Property data
 */
function parseProperty (propertyElement, currentLocale) {
    var attrs       = propertyElement.attributes;
    var name        = h.parseString(attrs.name);
    var label       = h.parseString(attrs.label);
    var manageable  = attrs.manageable;
    var readonly    = h.parseBool(attrs.readonly);
    var localizable = attrs.localizable;
    var viewhints   = attrs.viewHint && h.parseViewhint(attrs.viewHint);
    var type        = attrs.type;

    var currentLocaleValue = null;

    var valueElements = h.toArray(propertyElement.getElementsByTagName('value'));

    var values = valueElements.map(function (valueElement) {
        var value = parseValue(valueElement);

        if (value.locale === currentLocale) {
            currentLocaleValue = value;
        }

        return value;
    });

    if (!currentLocaleValue) {
        currentLocaleValue = values[0];
    }

    var property = {
        name: name,
        readonly: readonly || false,
        value: currentLocaleValue.value
    };

    if (label)      { property.label = label; }
    if (manageable) { property.manageable = h.parseBool(manageable); }
    if (viewhints)  { property.viewhints = viewhints; }

    if (type && (type.value === 'contentRef' || type.value === 'linkRef')) {
        property.type = type.value;
    } else if (currentLocaleValue.type === 'contentRef' || currentLocaleValue.type === 'linkRef') {
        property.type = currentLocaleValue.type;
    }

    if (localizable) {
        property.localizable = h.parseBool(localizable);

        if (property.localizable && Object.keys(values).length > 1) {
            property._lang = values.reduce(function (obj, item) {
                var key = item.locale;
                obj[key] = { value: item.value };
                return obj;
            }, {});
        }
    }

    return property;
}

/**
 * Parses array of tags from given item node
 * @param {Node} node Item's node
 * @return {Array<object>} Array of tags
 */
function parseTags (node) {
    var parent = h.getChildElementByName(node, 'tags');
    var tagElements = (parent && h.toArray(parent.children));

    return tagElements && tagElements.map(parseTag);
}

/**
 * Parses tag data from given tag node
 * @param {Node} tagElement <tag ...> node
 * @return {Object}
 */
function parseTag (tagElement) {
    return {
        type: tagElement.attributes.type.value,
        name: h.parseString({value: tagElement.textContent})
    };
}

/**
 * Returns true if property's type needs to be specific
 * @param {string} type Property's type
 * @return {boolean}
 */
// function valueTypeNeeded (type) {
//     return type && type === 'contentRef' || type === 'linkRef';
// }

/**
 * Parse localized values for given property
 * @param {Element} valueElement
 * @return {{value: string, locale: string|undefined }}
 */
function parseValue (valueElement) {
    return {
        value: valueElement.textContent,
        type: valueElement.getAttribute('type'),
        locale: valueElement.getAttribute('locale')
    };
}

},{"../../core/locale":174,"./constants":185,"./helpers":186}],188:[function(require,module,exports){
'use strict';

var locale = require('../../core/locale');
var merge = require('lodash/object/merge');
var parseItem = require('./item');
var h = require('./helpers');

module.exports = parseLink;

/**
 * Extracts link specific data from given node.
 * @param {Node} node Page node
 */
function parseLink(node) {
    var item = parseItem(node);
    var properties = item.preferencesDict;

    // TODO: check for other types
    var type = properties.itemType;
    if (type === 'menuHeader') {
        type = 'LINK';
    }

    var link = {
        children: [],
        itemType: type,
        title:    properties.title,
        locale:   h.content(node, 'locale', 'en') || locale.defaultLocale,
        dir:      h.content(node, 'dir', 'ltr'),
    };

    switch(type) {
        case 'LINK':
            parseHeader(link, properties);
            break;
        case 'divider':
            parseDivider(link, properties);
            break;
        case 'page':
            parsePage(link, properties);
            break;
        case 'externalLink':
            parseExternalLink(link, properties);
            break;
        case 'redirect':
            parseRedirect(link, properties);
            break;
    }
    var children = parseChildren(node);
    if ((children || []).length > 0) {
        link.children = children;
    }

    delete link.preferencesDict;

    return merge(item, link);
}

/**
 * Parses Header specific link nodes (Main Navigation, Not in Navigation)
 * @param {Object} link
 * @param {Object} properties
 * @private
 */
function parseHeader (link, properties) {
    link.navPattern = null;
}

/**
 * Parses Page specific link nodes
 * @param {Object} link
 * @param {Object} properties
 * @private
 */
function parsePage (link, properties) {
    link.itemRef = properties.ItemRef;
    link.href = properties.generatedUrl;

    if (properties.Url) {
        link.url = properties.Url;
    }

    link.generatedUrl = properties.generatedUrl;
}

/**
 * Parses Divider specific link nodes
 * @param {Object} link
 * @param {Object} properties
 * @private
 */
function parseDivider (link, properties) {
    link.className = properties.className;
}

/**
 * Pasers ExternalLink specific link nodes
 * @param {Object} link
 * @param {Object} properties
 * @private
 */
function parseExternalLink (link, properties) {
    link.url = properties.Url;
}

/**
 * Parses Redirect specific link nodes
 * @param {Object} link
 * @param {Object} properties
 * @private
 */
function parseRedirect (link, properties) {
    link.redirectionMethod = properties.redirectionMethod;
    link.url = properties.Url;
    link.targetPage = properties.targetPage;
}

/**
 * Parses page's childrens.
 * @param {Node} node Page node
 * @return {Array<object>} Array of children pages
 */
function parseChildren (node) {
    var parent = h.getChildElementByName(node, 'children');
    var childrenElements = parent && h.toArray(parent.children);
    return childrenElements && childrenElements.map(parseLink);
}

},{"../../core/locale":174,"./helpers":186,"./item":187,"lodash/object/merge":166}],189:[function(require,module,exports){
'use strict';

var locale = require('../../core/locale');
var parseItem = require('./item');
var parseWidget = require('./widget');
var merge = require('lodash/object/merge');
var common = require('./common');
var h = require('./helpers');

module.exports = parsePage;

/**
 * Parses given page specific XML element into JSON object
 * @param {Node} pageNode
 * @returns {Object}
 */
function parsePage (node) {
    var item = parseItem(node);
    var properties = item.preferencesDict;

    var page = {
        children:    [],
        description: properties.Description,
        dir:         h.content(node, 'dir', 'ltr'),
        icons:       common.parseIcons(node, properties),
        locale:      h.content(node, 'locale', 'en') || locale.defaultLocale,
        title:       properties.title
    };

    h.assignIfExists(page, 'manageable', h.parseBool(h.content(node, 'manageable')));

    var children = parseChildren(node);
    if ((children || []).length > 0) {
        page.children = children;
    }

    delete item.preferencesDict;

    return merge(item, page);
}

/**
 * Parses children widgets
 * @param {Node} node Widget node
 * @return {Array<object>} Array of widget objects
 */
function parseChildren (node) {
    var parent = node.getElementsByTagName('children')[0];
    var childrenElements = parent && h.toArray(parent.children);
    return childrenElements && childrenElements.map(parseWidget).sort(common.childComparator);
}

},{"../../core/locale":174,"./common":184,"./helpers":186,"./item":187,"./widget":190,"lodash/object/merge":166}],190:[function(require,module,exports){
'use strict';

var merge = require('lodash/object/merge');
var parseItem = require('./item');
var common = require('./common');
var h = require('./helpers');

module.exports = parseWidget;

/**
 * Parses widget specific data for given Node
 * @param {Node} node widget node
 * @param {Object} logger Logger
 * @return {Object} widget object
 */
function parseWidget (node, logger) {
    var item = parseItem(node);
    var preferences = item.preferencesDict;

    var widget = {
        content:         parseContent(node, preferences),
        description:     preferences.Description,
        dir:             h.content(node, 'dir', 'ltr'),
        icons:           common.parseIcons(node, preferences),
        title:           preferences.title
    };

    h.assignIfExists(widget, 'isManageableArea', h.parseBool(preferences.isManageableArea));
    h.assignIfExists(widget, 'viewmodes',        parseViewmodes(preferences));
    h.assignIfExists(widget, 'manageable',       h.parseBool(h.content(node, 'manageable')));
    h.assignIfExists(widget, 'author',           preferences.author);
    h.assignIfExists(widget, 'authorEmail',      preferences.authorEmail);
    h.assignIfExists(widget, 'authorHref',       preferences.authorHref);
    h.assignIfExists(widget, 'width',            preferences.width);
    h.assignIfExists(widget, 'height',           preferences.height);
    h.assignIfExists(widget, 'version',          preferences.version);
    h.assignIfExists(widget, 'license',          preferences.license);
    h.assignIfExists(widget, 'licenseHref',      preferences.licenseHref);
    h.assignIfExists(widget, 'settingsContent',  parseSettings(node, preferences));

    var children = parseChildren(node);
    if ((children || []).length > 0) {
        widget.children = children;
    }

    // TODO: This is temporary solution until real datasources implemented on the backend
    var datasourcesStr = preferences.datasources;
    if (datasourcesStr && datasourcesStr.length) {
        try {
            var datasources = JSON.parse(datasourcesStr);
            widget.datasources = datasources.reduce(function (obj, dataSource) {
                obj[dataSource.name] = dataSource;
                return obj;
            }, {});
        } catch (err) {
            logger.error(err.message);
        }
    }

    delete item.preferencesDict;

    return merge(item, widget);
}

/**
 * Parses start file specific part of widget
 * @param {Node} node widget node
 * @param {Object} properties Properties as Key/Value
 * @return {Object} Content object
 */
function parseContent (node, properties) {
    var content = { src: '', type: 'text/html', encoding: 'UTF-8' };
    h.assignIfExists(content, 'src', properties.src);
    h.assignIfExists(content, 'config', properties.config);
    return content;
}

/**
 * Parses settings file specific part of widget
 * @param {Node} node widget node
 * @param {Object} properties Properties as Key/Value
 * @return {Object}
 */
function parseSettings (node, properties) {
    if (h.isExists(properties.settingsSrc)) {
        return { src: properties.settingsSrc };
    }
}

/**
 * Parses viewmodes
 * @param {Object} properties Dictionary (Key/Value) of properties
 * @return {Array<string>} Array of viewmodes
 */
function parseViewmodes(properties) {
    var viewmodes_str = properties.viewmodes;
    var chrome = properties.widgetChrome;

    if (viewmodes_str) {
        return viewmodes_str.split(/\s+/);
    } else if (chrome && chrome.indexOf('widget_none') < 0) {
        return ['windowed'];
    } else {
        return [];
    }
}

/**
 * Parses children widgets
 * @param {Node} node Widget node
 * @return {Array<object>} Array of widget objects
 */
function parseChildren (node) {
    var parent = node.getElementsByTagName('children')[0];
    var childrenElements = parent && h.toArray(parent.children);
    return childrenElements && childrenElements.map(parseWidget).sort(common.childComparator);
}

},{"./common":184,"./helpers":186,"./item":187,"lodash/object/merge":166}],191:[function(require,module,exports){
'use strict';

var Model = require('../core/model');
var XmlItemContext = require('./xml-item-context');
var XmlItemCollectionContext = require('./xml-item-collection-context');

/**
 * Model Api - XmlCxp implementation
 * @module model/strategies/xml-cxp-model
 * @exports {XmlCxpModel} The constructor
 */
module.exports = {
    XmlCxpModel: XmlCxpModel,
    createInstance: createInstance
};

/**
 * XmlCxp implementation for Model interface
 * @see model/core/model/Model
 * @param {Configuration} configuration
 * @constructor
 */
function XmlCxpModel(configuration) {
    Model.apply(this, [configuration]);
}

XmlCxpModel.prototype = Object.create(Model.prototype);

/**
 * @see model/core/model#items
 */
XmlCxpModel.prototype.items = function (itemType) {
    return new XmlItemCollectionContext(this.config, this._cache, itemType);
};

/**
 * @see model/core/model#item
 */
XmlCxpModel.prototype.item = function (itemName, itemType) {
    return new XmlItemContext(this.config, this._cache, itemName, itemType);
};

/**
 * @see model/core/model#itemById
 */
XmlCxpModel.prototype.itemById = function (itemId, itemType) {
    return new XmlItemContext(this.config, this._cache, itemId, itemType, true);
};

/**
 * Creates a new XmlCxpModel instance
 * @param {Configuration} configuration
 * @returns {XmlCxpModel}
 */
function createInstance(configuration) {
    return new XmlCxpModel(configuration);
}

},{"../core/model":177,"./xml-item-collection-context":192,"./xml-item-context":193}],192:[function(require,module,exports){
'use strict';

var xmlParser = require('../parsers/xml-parser');
var xmlGenerator = require('../generators/xml-generator');
var ItemCollectionContext = require('../core/item-collection-context');
//var _ = require('../../util')._;
var restApiConsumer = require('../core/rest-api-consumer');

/**
 * XmlItemCollectionContext
 * @module model/strategies/xml-item-collection-context
 * @exports {XmlItemCollectionContext}
 */
module.exports = XmlItemCollectionContext;

/**
 * @see model/core/item-collection-context
 */
function XmlItemCollectionContext (config, cache, type, filters) {
    ItemCollectionContext.call(this, config, cache, type, filters);

    this.apiConsumer = restApiConsumer.createInstance(this.config);
}

XmlItemCollectionContext.prototype = Object.create(ItemCollectionContext.prototype);

/**
 * @see model/core/item-collection-context
 */
XmlItemCollectionContext.prototype.get = function () {
    var portalName = this.config.get('portalName');
    var endpoint = 'portals/' + portalName + '/' + this.type + 's';
    var filter = this._filter;
    var requiredParams = this._requiredParams;
    var filterQuery = [];
    var requiredParamsQuery = [];

    if (filter) {
        filterQuery = ['f=' + filter.name + '(' + filter.operator + ')' + encodeURIComponent(filter.value)];
    }

    // Some item types requires certain type of query params
    // @see model/core/item-collection-context#_getRequiredParams
    if (this._requiredParams) {
        requiredParamsQuery = Object.keys(requiredParams).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(requiredParams[key]);
        });
    }

    var query = filterQuery.concat(requiredParamsQuery).join('&');
    endpoint += (query.length > 0 ? '?' + query : '');

    return this.apiConsumer.get(endpoint).then(function (response) {
        return response.text();
    }).then(function (xmlString) {
        this.logger.info('Parsing %s', endpoint);
        var items = xmlParser.parse(xmlString, this.type + 's', this.type === 'container');
        this.logger.info('%s parsed successfully');

        return items;
    }.bind(this));
};

/**
 * @see model/core/item-collection-context
 */
XmlItemCollectionContext.prototype.filter = function (name, value, operator) {
    var filter = { name: name, value: value, operator: operator || 'eq' };
    return new XmlItemCollectionContext(this.config, this._cache, this.type, filter);
};

/**
 * @see model/core/item-collection-context#create
 */
XmlItemCollectionContext.prototype.create = function (model) {
    var requiredFields = ['parentItemName', 'extendedItemName'];

    requiredFields.forEach(function (field) {
        if (typeof model[field] === 'undefined' || 
            typeof model[field] !== 'string' || 
            model[field].length === 0) {
            throw new Error('ItemCollectionContext.create needs the model has the field named: ' + field);
        }
    });

    var portalName = this.config.get('portalName');

    model.contextItemName = portalName;

    if (typeof model.preferences === 'undefined') {
        model.preferences = [];
    }

    var itemXml = xmlGenerator.generate(model, this.type);
    var endpoint = 'portals/' + portalName + '/' + this.type + 's';

    return this.apiConsumer.post(endpoint, itemXml).then(function (response) {
        return response.text();
    }).then(function (newItemXml) {
        this.logger.info('Parsing newly created item\'s xml');
        var item = xmlParser.parse(newItemXml, this.type, this.type === 'container');
        this.logger.info('Newly created item parsed successfully');

        return item;
    }.bind(this));
};

},{"../core/item-collection-context":172,"../core/rest-api-consumer":178,"../generators/xml-generator":182,"../parsers/xml-parser":183}],193:[function(require,module,exports){
'use strict';

var xmlParser = require('../parsers/xml-parser');
var xmlGenerator = require('../generators/xml-generator');
var restApiConsumer = require('../core/rest-api-consumer');

var ItemContext = require('../core/item-context');

/**
 * XmlItemContext
 * @module model/strategies/xml-item-context
 * @exports {XmlItemContext}
 */
module.exports = XmlItemContext;

/**
 * @see model/core/item-context
 */
function XmlItemContext (config, cache, itemName, itemType, findById) {
    ItemContext.call(this, config, cache, itemName, itemType, findById);

    this.apiConsumer = restApiConsumer.createInstance(this.config);
}

XmlItemContext.prototype = Object.create(ItemContext.prototype);

/**
 * @see model/core/item-context/ItemContext#get
 */
XmlItemContext.prototype.get = function (force) {
    if (force) {
        this._cache.remove(this.itemType, this.itemName);
    }

    if (this.findById) {
        return this._getItemById();
    } else {
        return this._getItemByName();
    }
};

/**
 * @private
 */
XmlItemContext.prototype._buildParams = function () {
    return Object.keys(this._requiredParams).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(this._requiredParams[key]);
    }.bind(this)).join('&');
};

/**
 * @private
 */
XmlItemContext.prototype._getItemByName = function () {
    var promise = this._cache.get(this.itemType, this.itemName);
    if (promise) {
        return promise;
    }

    var portalName = this.config.get('portalName');
    var itemEndpointPart = this.itemType + 's/' + this.itemName + '.xml';
    var endpoint = 'portals/' + portalName + '/' + itemEndpointPart;

    var params = this._buildParams();
    if (params.length > 0) {
        endpoint += '?' + params;
    }

    promise = this.apiConsumer.get(endpoint).then(function (response) {
        return response.text();
    }).then(function (xmlString) {
        this.logger.info('Parsing response from [%s]', itemEndpointPart);
        var item = xmlParser.parse(xmlString, this.itemType, this.itemType === 'container');
        this.logger.info('Response from [%s] parsed successfully', itemEndpointPart);

        this._cache.update(this.itemType, item.id, promise);
        this._cache.update(this.itemType, item.name, promise);

        return item;
    }.bind(this));

    return promise;
};

/**
 * @private
 */
XmlItemContext.prototype._getItemById = function () {
    var promise = this._cache.get(this.itemType, this.itemName);
    if (promise) {
        return promise;
    }

    var portalName = this.config.get('portalName');
    var uuid = encodeURIComponent(this.itemName);
    var itemTypePlural = this.itemType + 's';
    var itemTypeEndpointPart = itemTypePlural + '?f=uuid(eq)' + uuid;
    var endpoint = 'portals/' + portalName + '/' + itemTypeEndpointPart;

    var params = this._buildParams();
    if (params.length > 0) {
        endpoint += '&' + params;
    }

    promise = this.apiConsumer.get(endpoint).then(function (response) {
        return response.text();
    }).then(function (xmlString) {
        this.logger.info('Parsing response from [%s]', itemTypeEndpointPart);
        var items = xmlParser.parse(xmlString, itemTypePlural, this.itemType === 'container');
        this.logger.info('Response from [%s] parsed successfully', itemTypeEndpointPart);

        var item = items[0];
        if (!item) {
            throw new Error('Item of type [' + this.itemType + '] with id [' + this.itemName + '] not found');
        }

        this._cache.update(this.itemType, item.id, promise);
        this._cache.update(this.itemType, item.name, promise);

        return item;
    }.bind(this));

    return promise;
};

/**
 * @see model/core/item-context/ItemContext#update
 */
XmlItemContext.prototype.update = function (model) {
    var portalName = this.config.get('portalName');
    var endpoint = 'portals/' + portalName + '/' + (this.itemType) + 's/' + this.itemName;

    var modelXml = xmlGenerator.generate(model, this.itemType);

    return this.apiConsumer.put(endpoint, modelXml).then(function () {
        this._cache.remove(this.itemType, model.id);
        this._cache.remove(this.itemType, model.name);
        this.logger.info('%s named %s updated successfully', this.itemType, this.itemName);
    }.bind(this));
};

/**
 * @see model/core/item-context/ItemContext#revert
 */
XmlItemContext.prototype.revert = function () {
    var portalName = this.config.get('portalName');
    var endpoint = 'portals/' + portalName + '/' + this.itemType + 's/' + this.itemName + '.xml';

    return this.apiConsumer.delete(endpoint).then(function () {
        this._cache.remove(this.itemType, this.itemName);
    }.bind(this));
};

/**
 * @see model/core/item-context/ItemContext#remove
 */
XmlItemContext.prototype.remove = function () {
    var portalName = this.config.get('portalName');
    var endpoint = 'portals/' + portalName + '/' + (this.itemType) + 's/' + this.itemName;

    return this.apiConsumer.delete(endpoint).then(function () {
        this._cache.remove(this.itemType, this.itemName);
    }.bind(this));
};

},{"../core/item-context":173,"../core/rest-api-consumer":178,"../generators/xml-generator":182,"../parsers/xml-parser":183}],194:[function(require,module,exports){
'use strict';

var Html5ItemRenderer = require('./strategies/html5-item-renderer');

/**
 * This function constructs a new HTML5 item tree renderer.
 *
 * <p>It uses a a Widget Engine or a Container Engine to render each item in the model tree. Models with children
 * are automatically rendered using the Container Engine and leaf nodes are rendered using the Widget Engine.
 *
 * <p>It uses an <code>itemEngineLocator</code> to determine which Engines to use. You may supply your own locator
 * to provide custom implementations
 *
 * @module cxp-renderer/index
 * @exports {Function} Generates a new instance of a cxp renderer
 * @param {CxpConfig} cxpConfig A CXP configuration object
 * @returns {*|Html5ItemRenderer|exports}
 */
var createRenderer = function(cxpConfig) {

    if(!cxpConfig.get('contextRoot')) {
        cxpConfig.set('contextRoot', '');
    }

    if(!cxpConfig.get('remoteContextRoot')) {
        cxpConfig.set('remoteContextRoot', '');
    }

    return new Html5ItemRenderer(cxpConfig);
};
      
//export
module.exports = {
    createInstance: createRenderer
};

},{"./strategies/html5-item-renderer":195}],195:[function(require,module,exports){
(function (global){
/**
 * Renders a CXP model tree within one DOM
 * @module strategies/html5-item-renderer
 * @exports {Html5ItemRenderer} Exports the constructor
 */

'use strict';

var Handlebars        = require('handlebars/dist/handlebars.min');
var HandlebarsHelpers = require('handlebars-helpers');
var ExtPromise        = require('promise-extensions')(Promise);
var bunyan            = require('browser-bunyan');
var util              = require('../../util')._;
var fetch             = global.fetch;

//chromes is only rendered if a widget has one of these view modes
var CHROME_VIEWMODES = [
    'windowed',
    'maximized'
];

// chrome template cache (shared among all renderer instances)
var chromeTemplatePromises = {};

var handlebarsInstance = Handlebars.create();

// add default helpers for chrome support
Object.keys(HandlebarsHelpers).forEach(function (helperName) {
    handlebarsInstance.registerHelper(helperName, HandlebarsHelpers[helperName]);
});

/**
 * <p>Creates an Html5ItemRenderer instance
 * <p>The chromeTemplate must be a precompiled Handlebars template that was compiled with the 'simple' option. Widgets
 * and containers with the viewmodes 'windowed' or 'maximized' will be wrapped with this template.
 *
 * <p>A widget chrome should contain a DIV element with the attribute 'data-widget-holder'. This is used to identify where
 * to inject the widget into the template. A widget chrome is rendered using a special Handlebars template.
 *
 * @constructor
 * @param {Object} cxpConfig The CXP Configuration object. It must contain an itemEngineLocator object.
 * @param {Object} cxpConfig.itemEngineLocator An object with single "locate" method for resolving a widget engine.
 * @param {Object} cxpConfig.chromeSrc A URL to a Handlebars template for wrapping items with chrome.
 *
 * @example
 * &lt;div class="panel panel-default"&gt;
 *   &lt;div class="pull-right"&gt;
 *   {{#allowEdit}}
 *     &lt;button type="button" class="btn btn-default btn-xs" title="Settings" data-cxp-settings="{{id}}"&gt;
 *       &lt;span class="glyphicon glyphicon-wrench"&gt;&lt;/span&gt;
 *     &lt;/button&gt;
 *   {{/allowEdit}}
 *   &lt;/div&gt;
 *   &lt;div class="panel-heading"&gt;{{name}}&lt;/div&gt;
 *   &lt;div class="panel-body" data-widget-holder&gt;&lt;/div&gt;
 * &lt;/div&gt;
 */
var Html5ItemRenderer = function(cxpConfig) {

    this.config = cxpConfig;
    if(!this.config.get('itemEngineLocator')) {
        throw new Error('You must provide an item engine locator');
    }

    this.log = cxpConfig.getLogger().child({
        childName: 'html5-item-renderer'
    });

    this.plugins = [];
    this.features = [];
    this._widgetEngines = [];
};

module.exports = Html5ItemRenderer;

/**
 * Starts the rendering process
 * @param {(Object | Object[])} model - A model tree or a list of models to render
 * @param {DOMNode} rootNode - A DOM node to start rendering within
 * @param {Object} opts Additional rendering options
 * @param {boolean} opts.useChrome Option which will disable use of a custom chrome template provide in the
 *                                 configuration object. Defaults to true
 * @returns {Promise} Resolves when all items are rendered
 */
Html5ItemRenderer.prototype.start = function(model, rootNode, opts) {
    if (!model || model.length === 0) {
        return ExtPromise.resolve();
    }

    opts = opts || {};

    var log = this.log;
    var self = this;

    log.info('Starting item tree rendering...');
    if(log.level() <= bunyan.TRACE) {
        log.trace('Item tree model is this:\n %s', JSON.stringify(model, null, '\t'));
    }

    var startTime = Date.now();

    //clear any current children
    while (rootNode.firstChild) {
        rootNode.removeChild(rootNode.firstChild);
    }

    var modelList = util.isArray(model) ? model : [model];

    // get chrome template
    var templatePromise = opts.useChrome !== false ?
        self._loadChromeTemplate(self.config.get('chromeSrc')) :
        ExtPromise.resolve(null);

    return templatePromise.then(function (chromeTemplate) {
        var renderResults = [];

        modelList.forEach(function(itemModel) {
            var childRoot = self._createChromeNode(itemModel, rootNode, chromeTemplate);
            renderResults.push(self._renderItem(itemModel, childRoot, {
                chromeTemplate: chromeTemplate
            }));
        });

        return ExtPromise.settleAll(renderResults);
    }).then(function(itemRenderInspections) {
        log.info('Item tree rendering complete.');

        var time = Date.now() - startTime;
        var result = {
            time: time,
            failures: []
        };

        //convert promise inspections into nice result object
        result = itemRenderInspections.reduce(function(result, inspection) {
            if(inspection.isRejected()) {
                var cause = typeof inspection.reason.cause === 'function' ?
                    inspection.reason.cause() :
                    inspection.reason;

                result.failures.push(cause);
            }
            return result;
        }, result);

        var errCount = result.failures.length;
        if(errCount > 0) {
            log.warn('%s/%s items failed to load.', errCount, itemRenderInspections.length);
        }

        //if every item failed to render, it's bad! Throw an error
        if(errCount === itemRenderInspections.length) {
            var err = new Error('All items in a rendering tree failed to render');
            err.result = result;
            throw err;
        }

        return result;
    });
};

/**
 * Adds a widget feature to all items being rendered
 * @method
 * @param {Object} feature
 */
Html5ItemRenderer.prototype.addFeature = function(feature) {
    if(typeof feature === 'object') {
        this.features.push(feature);
    }
    return this;
};

/**
 * Adds a widget plugin to all items being rendered
 * @method
 * @param {Object} plugin
 */
Html5ItemRenderer.prototype.addPlugin = function(plugin) {

    if(typeof plugin === 'object') {
        this.plugins.push(plugin);
    }

    return this;
};

/**
 * Recursively renders an item model tree
 * @private
 * @param itemModel
 * @param domNode
 * @param opts
 * @param opts.chromeTemplate
 */
Html5ItemRenderer.prototype._renderItem = function (itemModel, domNode, opts) {
    var self = this; // jshint ignore:line
    var config = this.config;
    var engineLocator = config.get('itemEngineLocator');

    //strip file from widget src to get path
    var widgetPath = '';

    if (itemModel.content && itemModel.content.src) {
        widgetPath = itemModel.content.src.replace(/\/[^\/]+$/, '');
    } else if (itemModel.content && itemModel.content.config) {
        widgetPath = itemModel.content.config.replace(/\/[^\/]+$/, '');
    } 

    //also replace context root placeholder
    widgetPath = widgetPath.replace(/\$\(contextRoot\)/, config.get('contextRoot'));

    var engine = engineLocator.locate(itemModel, {
        widgetUrl: widgetPath,
        widgetEl: domNode,
        initialModel: itemModel,
        locale: itemModel.locale,
        configVars: {
            authenticatedUserName: config.get('authenticatedUserName'),
            contextRoot:           config.get('contextRoot'),
            designmode:            config.get('designmode'),
            isAdmin:               config.enabled('isAdmin'),
            isManager:             config.enabled('isManager'),
            isMasterPage:          config.enabled('isMasterPage')
        },
        log: this.log
    });

    //add user defined plugins
    this.plugins.forEach(function (plugin) {
        if (typeof engine.addPlugin === 'function') {
            engine.addPlugin(plugin);
        }
    });

    //add user defined features
    this.features.forEach(function (feature) {
        if (typeof engine.addFeature === 'function') {
            engine.addFeature(feature);
        }
    });

    var engineResult = engine.start(itemModel, domNode);

    //the delay here seems to fix an issue with Safari in iOS where calling DOMParser().parseFromString()
    //a few times in quick succession causes it to return undefined (a browser bug)
    //see: https://backbase.atlassian.net/browse/BACKLOG-9708
    return engineResult.delay(0).then(function (result) {
        self._widgetEngines.push(engine);

        var renderPromises = [];
        //if the rendered item is a container, render its children
        var areaNodes = result.areaNodes;
        if (areaNodes) {
            for (var area in areaNodes) {
                if (areaNodes.hasOwnProperty(area)) {
                    /* jshint ignore:start */
                    //find child model(s) with matching area
                    var childrenForArea = itemModel.children.filter(function (item) {
                        return self.config.util.getPreferenceValue(item, 'area') === area;
                    });

                    self.log.info('Rendering %s child item(s) for area [%s] of item [%s]...', childrenForArea.length, area, result.id);

                    //loop through children for this area and render
                    childrenForArea.forEach(function (itemForArea) {
                        var childRoot = self._createChromeNode(itemForArea, areaNodes[area], opts.chromeTemplate);
                        //recurse
                        renderPromises.push(self._renderItem(itemForArea, childRoot, opts));
                    });
                    /* jshint ignore:end */
                }
            }
        }
        return ExtPromise.all(renderPromises);
    });
};

/**
 * Destroy all the widgets including dom and inline scripts
 * created during rendering widget
 */
Html5ItemRenderer.prototype.destroyAllItems = function () {
    this._widgetEngines.forEach(function (engine) {
        engine.destroy();
    });

    this._widgetEngines = [];
};

/**
 * Destroy the given widget and it's resources
 *
 * @param {String} itemId Item id
 */
Html5ItemRenderer.prototype.destroyItem = function (itemId) {
    var engine = this._widgetEngines.filter(function (engine) {
        return engine.widgetEngine.config.initialModel.id === itemId;
    })[0];

    if (!engine) {
        return;
    }

    engine.destroy();

    var engineIndex = this._widgetEngines.indexOf(engine);
    this._widgetEngines.splice(engineIndex, 1);
};

/**
 * Re renders given item.
 *
 * @param {String} oldItemId item id needed for destroying item
 * @param {String} oldItemName item name needed for calculating items position in dom
 * @param {Object} itemModel item model to be rendered
 */
Html5ItemRenderer.prototype.rerenderItem = function (oldItemId, oldItemName, itemModel) {
    var placeholder = document.createElement('div');
    var itemChrome = document.querySelector('[data-chrome="' + oldItemName + '"]');
    itemChrome.parentNode.insertBefore(placeholder, itemChrome);

    this.destroyItem(oldItemId);
    return this.start(itemModel, placeholder).then(function () {
        var newChrome = placeholder.firstElementChild;

        placeholder.parentNode.insertBefore(newChrome, placeholder);
        placeholder.parentNode.removeChild(placeholder);
    });
};

/**
 * Creates chrome to wrap a rendered item
 * @private
 */
Html5ItemRenderer.prototype._createChromeNode = function(itemModel, domNode, chromeTemplate) {

    var widgetHolderNode;
    var widgetHolderAttr = 'data-widget-holder';
    var widgetHolderNodeSelector = '*[' + widgetHolderAttr + ']';

    //a chrome template is present and the widget has the appropriate viewmodes that require chrome
    // CHROME_VIEWMODES.indexOf(itemModel.viewmodes[0]) >= 0 check notes:
    // The first item in the collection of view modes is the current view mode. Subsequent items are supported
    // view modes in order of precedence.
    if(chromeTemplate && itemModel.viewmodes && CHROME_VIEWMODES.indexOf(itemModel.viewmodes[0]) >= 0) {
        var templateHtml = chromeTemplate(itemModel);

        //this is only really required for specs (jsdom) where insertAdjacentHTML is not supported
        if(!domNode.insertAdjacentHTML) {
            domNode.insertAdjacentHTML = function(position, html) {
                var node, container = this.ownerDocument.createElement('div');
                container.innerHTML = html;
                while ((node = container.firstChild)) {
                    domNode.appendChild(node);
                }
            };
        }

        // find out whether chrome layout has holder node and if it doesn't, log a warning
        var rootNode = global.document.createElement('div');
        rootNode.innerHTML = templateHtml;

        if (rootNode.querySelector(widgetHolderNodeSelector)) {
            domNode.insertAdjacentHTML('beforeend', templateHtml);
            // take the last 'data-widget-holder' element as we've just inserted it as part of chrome layout
            var widgetHolders = domNode.querySelectorAll(widgetHolderNodeSelector);

            widgetHolderNode = widgetHolders[widgetHolders.length - 1];
        } else {
            this.log.warn('Chrome layout doesn\'t have an element with "data-widget-holder" attribute. Falling back to blank chrome.');
        }
    }

    // if no chrome rendered (for whatever reason), return default widget holder node
    if (!widgetHolderNode) {
        widgetHolderNode = global.document.createElement('div');
        widgetHolderNode.setAttribute('data-chrome', itemModel.name);
        widgetHolderNode.setAttribute(widgetHolderAttr, '');
        domNode.appendChild(widgetHolderNode);
    }

    return widgetHolderNode;
};

/**
 * Downloads and compiles a chrome template. Saves template in a cache that is shared among all renderer instances.
 * @param {String} chromeUrl chrome template URL
 * @returns {Promise} A successfully resolved promise with either a compiled template or null if there is a failure in
 * getting a template or compiling it.
 * @private
 */
Html5ItemRenderer.prototype._loadChromeTemplate = function(chromeUrl) {
    if(!chromeUrl) {
        var message =
            'No chrome template is defined. Widgets with \'windowed\' or \'maximized\' viewmodes will not be displayed with chrome';
        this.log.warn(message);
        return ExtPromise.resolve(null);
    }

    // replace contextRoot
    var contextRoot = this.config.get('contextRoot');
    var url = chromeUrl.replace(/\$\(contextRoot\)/, contextRoot);
    var log = this.log;

    var compiledTemplatePromise = chromeTemplatePromises[url];

    if(!compiledTemplatePromise) {
        log.debug('Requesting chrome template from %s', url);
        compiledTemplatePromise = fetch(url, {credentials: 'same-origin'}).then(function(res) {
            log.debug('Chrome template request resolved. Status: %s', res.status);

            if (res.status === 0 || res.status === 200) {
                return res.text();
            } else {
                throw new Error(res.statusText);
            }
        }).then(function(templateBody) {
            log.trace('Chrome template body\n: %s', templateBody);
            log.debug('Compiling handlebars template instance from %s', url);

            // compile template
            try {
                return handlebarsInstance.compile(templateBody);
            } catch(err) {
                log.error('There was a problem compiling a handlebars template');
                throw err;
            }
        }).catch(function(e) {
            log.error(e);
            delete chromeTemplatePromises[url];
            
            return null;
        });

        chromeTemplatePromises[url] = compiledTemplatePromise;
    }

    return compiledTemplatePromise;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../util":196,"browser-bunyan":132,"handlebars-helpers":133,"handlebars/dist/handlebars.min":134,"promise-extensions":168}],196:[function(require,module,exports){
'use strict';

/**
 * Utils modules expose functional helpers etc.
 * @module Utils
 * @export isArray
 * @export isObject
 */
module.exports._ = {
    isArray: require('lodash/lang/isArray'),
    isObject: require('lodash/lang/isObject'),
    merge: require('lodash/object/merge')
};

/**
 * Converts array of values into an object.
 * @param {String} keyField
 * @param {String} valueField
 * @param {Object[]} array
 * @return {Object<string, *>}
 */
module.exports.arrayToObject = function (keyField, valueField, array) {
    return (array || []).reduce(function (obj, elem) {
        var key = elem[keyField];
        obj[key] = elem[valueField];
        return obj;
    }, {});
};

},{"lodash/lang/isArray":157,"lodash/lang/isObject":160,"lodash/object/merge":166}],197:[function(require,module,exports){
/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function () {
	var attachEvent = document.attachEvent,
		stylesCreated = false;
	
	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();
		
		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		function resetTriggers(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		};

		function checkTriggers(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}
		
		function scrollListener(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		};
		
		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }    
			
			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}
		
		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}
	
	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');
			
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}
	
	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);
				
				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};
	
	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	}
})();
},{}],198:[function(require,module,exports){
/*global document, DOMParser*/
// inspired by https://gist.github.com/1129031

'use strict';

(function(DOMParser) {
    var proto = DOMParser.prototype,
        nativeParse = proto.parseFromString;

    proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument('');

            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup;
            } else {
                doc.body.innerHTML = markup;
            }
            return doc;
        } else {
            return nativeParse.apply(this, arguments);
        }
    };
}(DOMParser));

window.system_scroll = window.scroll;
window.scroll = function(x, y) {
    window.cxp.mobile.scrollTo('' + x, '' + y);
    window.system_scroll(x, y);
};
},{}],199:[function(require,module,exports){
'use strict';

/**
 * Provides operations for publishing and subscribing to message channels.
 * @class
 */
window.b$.module('gadgets.pubsub', function() {

    var Class = window.b$.Class;

    /**
     * Class for the event buss.
     * @class
     * @private
     */
    var Channel = Class.extend(function() {
        this.callbacks = [];
    },{

        //queue of message
        queue: [],

        /**
         * Subscribes the callback to the channel.
         * @private
         */
        subscribe: function(callback) {
            this.callbacks.push(callback);
        },

        /**
         * Unsubscribes the callback from the channel.
         * @private
         */
        unsubscribe: function(callback) {
            if(!callback) {
                this.callbacks = [];
            }
            else {
                this.callbacks = this.callbacks.filter(function(fChannelCallback) {
                    return fChannelCallback !== callback;
                });
            }
        },

        /**
         * Publishes message to the channel.
         * @private
         */
        publish: function(message, flush) {
            if(flush) {
                this.flush();
            }

            this.callbacks.forEach(function(callback) {
                callback(message);
            });
        },

        /**
         * Clears the queue
         */
        flush: function() {
            this.queue = [];
        }
    });

    /**
     * Class for the event buss.
     * @class
     * @private
     */
    var EventBus = Class.extend(function() {
        this.channels = {};
    },{

        /**
         * Subscribes the callback to the channel.
         * @private
         * @method
         */
        subscribe: function(channelName, callback) {
            if (!this.channels[channelName]) {
                this.channels[channelName] = new Channel();
            }

            this.channels[channelName].subscribe(callback);

            window.cxp.mobile.subscribe(channelName);
        },

        /**
         * Unsubscribes the callback from the channel.
         * @method
         * @private
         */
        unsubscribe: function(channelName, fCallback) {

            if (this.channels[channelName]) {
                this.channels[channelName].unsubscribe(fCallback);

                window.cxp.mobile.unsubscribe(channelName);
            }
        },

        /**
         * Publishes message to the channel.
         * @private
         * @method
         */
        publish: function(channelName, oMessage, flush, eventType) {
            if (this.channels[channelName]) {
                this.channels[channelName].publish(oMessage, flush);
            }
            oMessage = oMessage || {};
            eventType = eventType || '';
            if(eventType !== 'SYSTEM') {
                window.cxp.mobile.publish(channelName, JSON.stringify(oMessage), eventType);
            }
        },

        /**
         * Flushes the message on a channel
         * @param channelName
         */
        flush: function(channelName) {
            if (this.channels[channelName]) {
                this.channels[channelName].flush();
            }
        }
    });

    var mainBus = new EventBus();

    /**
     * Publishes a string-type message to a channel.
     *
     * @param {String} channelName The name of the channel
     * @param {String} message The message to publish
     */
    function publish(channelName, message, flush, eventType) {
        if(typeof flush !== 'boolean') {
            flush = true;
        }
        mainBus.publish(channelName, message, flush, eventType);
    }

    /**
     * Subscribes a widget to a message channel.
     *
     * @param {String} channelName The name of the channel
     * @param {Function} callback A function that will be called with the channel messages
     */
    function subscribe(channelName, callback) {
        mainBus.subscribe(channelName, callback);
    }

    /**
     * Unsubscribes the widget from a message channel.
     *
     * @param {String} channelName The name of the channel
     */
    function unsubscribe(channelName, callback) {
        mainBus.unsubscribe(channelName, callback);
    }

    function flush(channelName) {
        mainBus.flush(channelName);
    }

    this.publish = publish;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
    this.flush = flush;
});

},{}],200:[function(require,module,exports){
'use strict';

//set up some global namespaces
window.cxp = window.cxp || {};
window.mobile = window.mobile || {};
window.cxp.mobile = window.mobile; //mobile references cxp.mobile because native android can only call one object deep

//this is the public interface to start rendering
window.cxp.mobile.render = function(widgetRoot, localContextRoot, remoteContextRoot, portalModel, plugins, logLevel,
                               syncPreferences, portalName) {
    
    require('./common/dom-parser-polyfill');
    require('javascript-detect-element-resize');
    require('./common/pubsub');

    //simple factory to get the desired renderer for the current platform
    var Renderer;
    var isSafariOrUiWebview = /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
    if(isSafariOrUiWebview) {
        console.info('Portal Client Mobile is rendering in iOS mode');
        var iosCxpBridge = require('./platforms/ios/ios-cxp-bridge');
        iosCxpBridge.enable();
        Renderer = require('./platforms/ios/ios-page-renderer');
    } else {
        console.info('Portal client mobile is rendering in Android mode');
        Renderer = require('./platforms/android/android-page-renderer');
    }
    
    window.cxp.mobile.plugins = plugins;

    //kick off rendering
    var renderer = new Renderer();
    renderer.render(document.getElementById(widgetRoot), portalModel, {
        portalName: portalName,
        localContextRoot: localContextRoot,
        remoteContextRoot: remoteContextRoot,
        syncPreferences: syncPreferences,
        logLevel: logLevel
    });
};

//legacy interface
window.renderWidget = window.cxp.mobile.render;
},{"./common/dom-parser-polyfill":198,"./common/pubsub":199,"./platforms/android/android-page-renderer":204,"./platforms/ios/ios-cxp-bridge":205,"./platforms/ios/ios-page-renderer":206,"javascript-detect-element-resize":197}],201:[function(require,module,exports){
'use strict';

/**
 * Logs records to a buffer until they are flushed to another log stream
 * @param size
 * @constructor
 */
var BufferedLogStream = function(size) {

    this.size = size || 1000;
    this.buffer = [];

    this.decoratedStreams = [];
};

/**
 * Flushing the log will write records to streams added with this method
 * @param stream
 */
BufferedLogStream.prototype.decorateStream = function(stream) {
    this.decoratedStreams.push(stream);
};

/**
 * Write a record to the buffer
 * @param rec
 */
BufferedLogStream.prototype.write = function(rec) {

    if (this.buffer.length >= this.size) {
        this.buffer.shift();
    }

    this.buffer.push(rec);
};

/**
 * Flushes the buffer to a stream
 */
/* jshint ignore:start */
BufferedLogStream.prototype.flush = function() {
    var rec;
    while (rec = this.buffer.shift()) {
        this.decoratedStreams.forEach(function(stream) {
            stream.write(rec);
        });
    }
};
/* jshint ignore:end */

/**
 * Clears the buffer
 */
BufferedLogStream.prototype.clear = function() {
    this.buffer = [];
};

module.exports = BufferedLogStream;
},{}],202:[function(require,module,exports){
'use strict';

/**
 * Logs messages to the console without any pretty formatting.
 * @param opts
 * @constructor
 */
function ConsolePlainStream(opts) {
    opts = opts || {};
    this.printLevel = !!opts.printLevel;
    this.printTimestamp = !!opts.printTimestamp;
}

/**
 * Write a Bunyan log record
 * @param rec
 */
ConsolePlainStream.prototype.write = function(rec) {

    var loggerName = rec.childName ? rec.name + '/' + rec.childName : rec.name;

    var logMethod;
    if (rec.level < 30) {
        logMethod = 'log';
    } else if (rec.level < 40) {
        logMethod = 'info';
    } else if (rec.level < 50) {
        logMethod = 'warn';
    } else {
        logMethod = 'error';
    }

    function padZeros(number, len) {
        return Array((len + 1) - (number + '').length).join('0') + number;
    }

    function getTimestamp() {
        return '[' +
            padZeros(rec.time.getHours(), 2) + ':' +
            padZeros(rec.time.getMinutes(), 2) + ':' +
            padZeros(rec.time.getSeconds(), 2) + ':' +
            padZeros(rec.time.getMilliseconds(), 4) + ']';
    }
    
    var timestamp = this.printTimestamp ? (getTimestamp() + ' ') : '';
    var level = this.printLevel ? (rec.levelName.toUpperCase() + ': ') : '';
    console[logMethod](timestamp + level + loggerName + ': ' + rec.msg);
};

module.exports = ConsolePlainStream;
},{}],203:[function(require,module,exports){
(function (global){
'use strict';

var document = global.document; // jshint ignore:line

/**
 * Write log messages by create iframes whose src attribute contains the log info. This creates network 
 * request which can be intercepted by the native side.
 * @constructor
 */
var IFrameBridgeLogStream = function() {
};

/**
 * Write a bunyan log record
 * @param rec
 */
IFrameBridgeLogStream.prototype.write = function(rec) {
    var iframe = document.createElement('IFRAME');
    iframe.setAttribute('src', 'log://?type=' + rec.levelName + '&msg=' + rec.msg + ' (' + rec.time + ')');
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;   
};

module.exports = IFrameBridgeLogStream;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],204:[function(require,module,exports){
'use strict';

var PageRenderer = require('../../render/page-renderer');
var ConsolePlainLogStream = require('../../logging/console-plain-log-stream');

/**
 * Android Page Renderer
 * @constructor
 */
var AndroidPageRenderer = function() {
    PageRenderer.call(this);
};

//
AndroidPageRenderer.prototype = Object.create(PageRenderer.prototype);

AndroidPageRenderer.prototype._createLogStreams = function(logLevel) {

    return [{
        level: logLevel,
        stream: new ConsolePlainLogStream()
    }];
};

AndroidPageRenderer.prototype._doRender = function (widgetModel, renderer, rootEl) {

    // Page only can be rendered by passing it's children.
    // Page object can't contain features property, thus this check
    // This check is unstable. We should update MBaaS to include a type on items instead
    var model = widgetModel.features ? widgetModel : widgetModel.children;

    renderer.start(model, rootEl).then(function(details) {

        var message = 'Item tree rendered in ' + details.time + 'ms',
            resizeElement = document.getElementsByTagName('html')[0], //the html could contain paddings/margins
            resizeCallback = function() {
                window.cxp.mobile.resize(resizeElement.scrollHeight);
            };
        window.addResizeListener(resizeElement, resizeCallback);
        console.log(message);
        window.cxp.mobile.itemLoaded();
    }).catch(function(err) {
        console.log(err);
    });
};

module.exports = AndroidPageRenderer;
},{"../../logging/console-plain-log-stream":202,"../../render/page-renderer":212}],205:[function(require,module,exports){
(function (global){
'use strict';

var window = global.window;  // jshint ignore:line
var document = global.document; // jshint ignore:line

module.exports = {
    enable: function () {

        //force XMLHttpRequests to include a request header
        if(window.XMLHttpRequest) {
            (function(__send) {
                XMLHttpRequest.prototype.send = function(data) {
                    this.setRequestHeader('cxp.nsurlrequest.webview', 'true');
                    __send.call(this, data);
                };
            })(XMLHttpRequest.prototype.send);            
        }

        function addIframe(src) {
            var iframe = document.createElement('IFRAME');
            iframe.setAttribute('src', src);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }

        function loaded(time) {
            addIframe('cxp-loaded://?time=' + time);
        }

        function reload() {
            addIframe('cxp-reload://');
        }

        function resizeTo(width, height) {
            addIframe('cxp-resize://?w=' + width + '&h=' + height);
        }

        function scrollTo(x, y) {
            addIframe('cxp-scroll://?x=' + x + '&y=' + y);
        }

        function publish(event, payload, eventType) {
            addIframe('cxp-publish://?event=' + encodeURIComponent(event) + '&type=' + encodeURIComponent(
                    eventType) + '&payload=' + encodeURIComponent(payload));
        }

        function subscribe(event) {
            addIframe('cxp-subscribe://?event=' + encodeURIComponent(event));
        }

        function unsubscribe(event) {
            addIframe('cxp-unsubscribe://?event=' + encodeURIComponent(event));
        }

        function executePlugin() {
            if (arguments.length === 0) {
                return;
            }
            var args = [];
            Array.prototype.push.apply(args, arguments);

            var plugin = args.shift();
            var method = args.shift();
            var params = args;
            for (var i = 0; i < params.length; i++) {
                params[i] = encodeURIComponent(params[i]);
            }

            addIframe('cxp-plugin://?plugin=' + encodeURIComponent(plugin) + '&method=' +
                encodeURIComponent(method) + '&params=' + params.join('&params='));
        }


        function callPlugin(pluginName, methodName, args, resolve, reject) {
            var _callbackId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, // jshint ignore:line
                    v = c == 'x' ? r : (r & 0x3 | 0x8); // jshint ignore:line
                return v.toString(16);
            });
            var eventName = [pluginName, methodName, _callbackId].join('.');
            var _unsubscribe = function () {
                window.gadgets.pubsub.unsubscribe('plugin.success.' + eventName, _success);
                window.gadgets.pubsub.unsubscribe('plugin.error.' + eventName, _error);
            };
            var _success = function (response) {
                if (!response.keep) {
                    _unsubscribe();
                }
                if (resolve) {
                    resolve(response.data);
                }
            };
            var _error = function (response) {
                if (!response.keep) {
                    _unsubscribe();
                }
                if (reject) {
                    reject(response.data);
                }
            };

            // convert object into JSON.stringify
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (typeof arg === 'object') {
                    args[i] = JSON.stringify(arg);
                }                 
            }

            window.gadgets.pubsub.subscribe('plugin.success.' + eventName, _success);
            window.gadgets.pubsub.subscribe('plugin.error.' + eventName, _error);

            executePlugin.apply(window.cxp.mobile, [pluginName, methodName, _callbackId].concat(args));
            return _callbackId;
        }

        window.cxp.mobile = {
            loaded: loaded,
            reload: reload,
            resizeTo: resizeTo,
            scrollTo: scrollTo,
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            callPlugin: callPlugin
        };
    }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],206:[function(require,module,exports){
'use strict';

var PageRenderer = require('../../render/page-renderer');
var ConsolePlainLogStream = require('../../logging/console-plain-log-stream');
var IFrameBridgeLogStream = require('../../logging/iframe-bridge-log-stream');
var BufferedLogStream = require('../../logging/buffered-log-stream');

/**
 * IOS Page Renderer
 * @constructor
 */
var IOSPageRenderer = function() {
    PageRenderer.call(this);
};

//extend PageRenderer
IOSPageRenderer.prototype = Object.create(PageRenderer.prototype);

/**
 * Creates IOS specific log streams
 * @param logLevel
 * @return {*[]}
 * @private
 */
IOSPageRenderer.prototype._createLogStreams = function(logLevel) {

    var consoleStream = new ConsolePlainLogStream({
        printTimestamp: true,
        printLevel: true
    });

    //buffered log stream allows a developer to replay the log by running bufferedLogStream.flush()
    var bufferedLogStream = new BufferedLogStream();
    bufferedLogStream.decorateStream(consoleStream);
    window.bufferedLogStream = bufferedLogStream; //expose globally

    //iframe log stream for logging to native land
    var iframeBridgeLogStream = new IFrameBridgeLogStream();

    //set up log streams
    return [{
        level: logLevel,
        stream: iframeBridgeLogStream
    }, {
        level: logLevel,
        stream: consoleStream
    }, {
        level: logLevel,
        stream: bufferedLogStream
    }];
};

/**
 * Does IOS specific rendering 
 * @param widgetModel
 * @param renderer
 * @param rootEl
 * @private
 */
IOSPageRenderer.prototype._doRender = function(widgetModel, renderer, rootEl) {
    var page = document.getElementsByTagName('html')[0]; //the html could contain paddings/margins
    window.addResizeListener(page, function() {
        window.cxp.mobile.resizeTo(page.scrollWidth, page.scrollHeight);
    });

    // Page only can be rendered by passing it's children.
    // Page object can't contain features property, thus this check
    // This check is unstable. We should update MBaaS to include a type on items instead
    var model = widgetModel.features ? widgetModel : widgetModel.children;

    renderer.start(model, rootEl).then(function(details) {
        window.cxp.mobile.loaded(details.time);
        window.cxp.mobile.resizeTo(page.scrollWidth, page.scrollHeight);
        var message = 'CXPMobile Widget-Engine: Item tree rendered in ' + details.time + 'ms';
        console.log(message);
    }).catch(function(err) {
        console.log(err);
    });
};

module.exports = IOSPageRenderer;
},{"../../logging/buffered-log-stream":201,"../../logging/console-plain-log-stream":202,"../../logging/iframe-bridge-log-stream":203,"../../render/page-renderer":212}],207:[function(require,module,exports){
'use strict';

module.exports = function(featureList) {

    featureList = featureList || [];

    return {
        name: 'add-feature-plugin',
        postRead: function (widgetModel) {
            if (featureList.length === 0) {
                return widgetModel;
            }

            if (!Array.isArray(widgetModel.features)) {
                widgetModel.features = [];
            }

            featureList.forEach(function (featureName) {
                var widgetModelAlreadyHasFeature = widgetModel.features.some(function (widgetFeature) {
                    return widgetFeature.name === featureName;
                });

                if (!widgetModelAlreadyHasFeature) {
                    widgetModel.features.push({
                        name: featureName,
                        required: false
                    });
                }
            });

            return widgetModel;
        }
    };
};
},{}],208:[function(require,module,exports){
'use strict';

module.exports = function addSupportToAccessChildren() {
    return {
        name: 'expose-children-plugin',
        preRender: function (widgetInstance, widgetRenderer, widgetModel) {
            widgetInstance.children = widgetModel.children ? widgetModel.children.map(function (child) {
                return {
                    id: child.id,
                    name: child.name
                };
            }) : [];
            return widgetInstance;
        }
    };
};
},{}],209:[function(require,module,exports){
'use strict';

module.exports = function iceContentWorkaroundPlugin() {
    return {
        name: 'ice-workaround-plugin',
        postRead: function(widgetModel) {
            var templatePref = widgetModel.preferences.filter(function(pref) {
                return pref.name === 'templateUrl';
            })[0];
            if(templatePref) {
                templatePref._ignoreReplace = true;
            }

            return widgetModel;
        }
    };
};
},{}],210:[function(require,module,exports){
/* globals Promise: false */
'use strict';

/*
Mobile Optimised Content (moc)

Description

This plugin caches ICE and structured content.

Usage

Include this plugin before the BackbaseFormatPlugin. If you include it
after, it doesn't do anything because the BackbaseFormatPlugin has
replaced the content g:includes with placeholders.

Internals

This plugin hooks into the postRender phase (it needs to have the widget
start file). It finds all ICE and structured content g:includes, and
renames them to moc:include so the BackbaseFormatPlugin cannot find them
anymore.

After this it checks the device cache (SimpleStorage) or localStorage
for the cached ICE / structured content template. If it finds a cached
template, it checks for expired caches. For ICE content it can do a very
nice check since ICE widgets include a special preference
(widgetContentsUpdated). For structured content it uses a simple hacky
expiry time which can be modified using widget preferences.

If the cache is empty or expired, the plugin fetches the ICE /
structured content template itself. After this it finds all CS content
urls and fetches the contents of those urls and transforms them into
data-uris. This allows us to cache just the template. After that it
saves the template to SimpleStorage or localStorage. This plugin caches
successful responses only!

Widget preferences

There are some optional widget preferences that influence the caching.
 - widgetContentsUpdated    added and updated by ICE widgets
 - contentsExpiry           how many hours to cache structured content
 - contentsCached           set this to false to disable caching

Events and activity indicators

This plugin doesn't replace the g:include with a placeholder, it just
renames it. So you can add a class or nest some image or other content
inside the g:include to show an activity indicator. After the content
is resolved, it replaces the g:include so the indicator will dissapear
automatically.

It is also possible to do this programatically. In your g:onload handler
you can display a spinner, and listen for the 'contentLoaded' and
'contentError' events by binding handlers to the widgetInstance.body.
In the handlers you can remove the spinner and show the content, or show
an error if the content cannot be fetched.
 */

/*
 *  helpers
 */
var hour = 60 * 60 * 1000;
var expiry = 24 * hour;

var credentials = {
    credentials: 'same-origin'
};

var mimeTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css'
};

var toArray = function(htmlCollection) {
    return [].slice.call(htmlCollection);
};

var htmlToElement = function(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
};

var replaceInclude = function(include, html) {
    var parent = include.parentNode;
    var newInclude = htmlToElement(html);

    parent.replaceChild(newInclude, include);

    return newInclude;
};

var createContentUrl = function(contextRoot, portalName, id) {
    return contextRoot + '/contenttemplates/rendered?' + 
        'contextItemName=' + portalName + '&' +
        'uuid=' + id;
};

var parseXmlText = function(text) {
    var parsed = (new window.DOMParser())
        .parseFromString('<foo>' + text + '</foo>', 'text/xml');
    return parsed && parsed.childNodes &&
        parsed.childNodes[0] && parsed.childNodes[0].textContent;
};

var urlToMimeType = function(url) {
    var extension = url.match('\.([^.]+)$')[1];
    return mimeTypes[extension];
};

var sendEvent = function(domNode, eventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    domNode.dispatchEvent(event);
};

var contextToServer = function(contextRoot) {
    return contextRoot.match(/^[^/]+\/\/[^/]+/);
};

/*
 *  storage functions
 */
var storage = window.localStorage;

var mangleName = function(id) {
    return 'moc-cache-' + id;
};

var readStorage = function(id, cb) {
    var simpleStorage = window.cxp && window.cxp.mobile &&
        window.cxp.mobile.plugins && window.cxp.mobile.plugins.SimpleStorage;

    return new Promise(function(resolve, reject) {
        if (simpleStorage) {
            simpleStorage.getItem(
                function(data){
                    if(data){
                        resolve(JSON.parse(data));
                    }else{
                        resolve();
                    }
                },
                // we do not reject the promise if the id isn't found in
                // storage, we just return undefined
                function() {
                    resolve();
                },
                mangleName(id)
            );
        } else {
            var data = storage[mangleName(id)];
            if (data) {
                resolve(JSON.parse(data));
            } else {
                // we do not reject the promise if the id isn't found in
                // storage, we just return undefined
                resolve();
            }
        }
    });
};

var writeStorage = function(id, content) {
    var simpleStorage = window.cxp && window.cxp.mobile &&
        window.cxp.mobile.plugins && window.cxp.mobile.plugins.SimpleStorage;

    return new Promise(function(resolve, reject) {
        if (simpleStorage) {
            simpleStorage.setItem(
                resolve,
                reject,
                mangleName(id),
                JSON.stringify(content)
            );
        } else {
            storage[mangleName(id)] = JSON.stringify(content);
            resolve();
        }
    });
};

/*
 *  Promise based functions
 */

// taken from https://davidwalsh.name/convert-image-data-uri-javascript
// changed to work with promises and to use proper mimeTypes
var getDataUri = function(url) {
    return new Promise(function(resolve, reject) {
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            canvas.getContext('2d').drawImage(this, 0, 0);

            resolve(canvas.toDataURL(urlToMimeType(url)));
        };

        image.onerror = function () {
            reject();
        };

        image.src = url;
    });
};

var fetchContent = function(contextRoot, portalName, id) {
    return fetch(createContentUrl(contextRoot, portalName, id), credentials)
        .then(function(res) {
            return res.status >= 200 && res.status < 300 ?
                Promise.resolve(res.text()) : Promise.reject(res.statusText);
        })
        .then(function(html) {
            // find all CS content urls to resolve
            return html
                .split(/([^"]+\/content\/bbp\/repositories\/[^"]+)/g);
        })
        .then(function(chunks) {
            return Promise.all(
                chunks
                    .map(function(chunk) {
                        if (/\/content\/bbp\/repositories\//.test(chunk)) {
                            return getDataUri(
                                contextToServer(contextRoot) +
                                // CS content urls seem to be XML encoded. Fix that here
                                parseXmlText(chunk)
                            );
                        }
                        return chunk;
                    })
            );
        })
        .then(function(chunks) {
            return chunks
                .join('');
        });
};

var resolveContent = function(contextRoot, portalName, model) {
    return readStorage(model.id)
        .then(function(content) {
            var cacheKey = model.preferences.widgetContentsUpdated ? model.preferences.widgetContentsUpdated.value : 0;
            var myExpiry = model.preferences.contentsExpiry ? model.preferences.contentsExpiry.value * hour : expiry;
            var contentsCached = model.preferences.contentsCached ? model.preferences.contentsCached.value === 'true' : true;
            
            // ICE widget - proper expiry detection using 'widgetContentsUpdated' preference in the model
            if (contentsCached && content && content.cacheKey && content.cacheKey === cacheKey) {
                return content.data;

            // Structured content - stupid cache expiry based on timeout
            } else if (contentsCached && content && content.expiry > Date.now()) {
                return content.data;

            // fetch content ourselves
            } else {
                return fetchContent(contextRoot, portalName, model.id)
                    .then(function(content) {
                        writeStorage(model.id, {
                            cacheKey: cacheKey,
                            expiry: cacheKey ? undefined : Date.now() + (myExpiry || expiry),
                            data: content
                        });
                        return content;
                    });
            }
        });
};

module.exports = function(contextRoot) {
    return {
        name: 'mobile-optimized-content-plugin',
        postRender: function(widgetInstance, widgetRenderer, widgetModel) {
            var portalName = widgetInstance.features.cxp.config.get('portalName');

            var includes = toArray(widgetInstance.body.getElementsByTagName('g:include'))
                .filter(function(include) {
                    return /\/contenttemplates\/rendered/.test(include.getAttribute('src')) &&
                        include.querySelectorAll('[name="templateUrl"]').length === 0;
                })
                .map(function(include) {
                    // replace the g:include with moc:include so the BackbaseFormatPlugin doesn't resolve it
                    var domNode = replaceInclude(include, include.outerHTML.replace(/g:include/g, 'moc:include'));

                    return resolveContent(contextRoot, portalName, widgetModel)
                        .then(function(content) {
                            replaceInclude(domNode, content);
                        });
                });

            if (includes.length) {
                Promise.all(includes)
                    // these fire only after all content g:includes have finished
                    .then(function() {
                        sendEvent(widgetInstance.body, 'contentLoaded');
                    })
                    .catch(function() {
                        sendEvent(widgetInstance.body, 'contentError');
                    });
            }

            return widgetInstance;
        }
    };
};
},{}],211:[function(require,module,exports){
(function (global){
'use strict';

var window = global.window; // jshint ignore:line

module.exports = function syncPreferencesPlugin(syncPreferences) {

    //global event bus for syncing preferences (see sync preferences plugin
    if(window.cxp && !window.cxp.mobile.syncPreferences) {
        window.cxp.mobile.syncPreferences = {
            listeners: [],
            update: function(action, key, value) {
                this.listeners.forEach(function(listener) {
                    listener.call(null, action, key, value);
                });
            },
            addListener: function(callback) {
                this.listeners.push(callback);
            }
        };        
    }
    
    return {
        name: 'sync-preferences-plugin',
        preRender: function (widgetInstance, widgetRenderer, widgetModel) {
            
            // initialization with the given syncPreferences
            widgetModel.preferences.forEach(function (pref) {
                // update only if the preference is defined and not readonly.
                if (!pref.readonly && pref.name in syncPreferences) {
                    if (syncPreferences[pref.name] === '__null__') {
                        syncPreferences[pref.name] = null;
                    }
                    widgetInstance.preferences.setItem(pref.name, syncPreferences[pref.name]);
                }
            });

            // listening to changes in the preferences externally
            window.cxp.mobile.syncPreferences.addListener(function (action, key, value) {
                // only affect the preferences in the syncPreferences list
                if (widgetInstance.preferences.hasOwnProperty(key) && (key in syncPreferences)) {
                    widgetInstance.preferences._eventsEnabled = false;
                    try {
                        if (action === 'setItem') {
                            widgetInstance.preferences.setItem(key, value);
                        } else if (action === 'removeItem') {
                            widgetInstance.preferences.setItem(key, null);
                        }
                    } catch (e) { // it might be readonly.
                        console.log(e);
                    }
                    widgetInstance.preferences._eventsEnabled = true;
                }
            });

            // broadcasting changes in the preferences
            widgetInstance.addEventListener('storage', function (ev) {
                if (ev.key in syncPreferences) {
                    var value = ev.newValue;
                    var feature = window.cxp.mobile.plugins.SyncedPreferences;
                    if (feature) {
                        feature.setItem(null, null, ev.key, value);
                    }
                }
            });
            return widgetInstance;
        }
    };
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],212:[function(require,module,exports){
(function (global){
/* jshint unused: vars */

'use strict';

var window = global.window || {}; // jshint ignore:line

//needed for spec to run
if(!global.window) {
    global.window = window;
}

//core portal
var cxpWebApis = require('cxp-web-apis');
var ReplaceConfigVarsPlugin = require('backbase-widget-engine/src/plugins/replace-config-vars-plugin');
var BackbaseFormatPlugin = require('backbase-widget-engine/src/plugins/backbase-format-plugin');
var widgetEngineLocator = require('./webview-widget-engine');

//plugins (these are all functions which should be called to get the plugin instance)
var addFeaturePlugin = require('../plugins/add-feature-plugin');
var exposeChildrenPlugin = require('../plugins/expose-children-plugin');
var iceWorkaroundPlugin = require('../plugins/ice-workaround-plugin');
var syncPreferenecsPlugin = require('../plugins/sync-preferences-plugin');
var mocPlugin = require('../plugins/mobile-optimised-content-plugin');

//retreive csrf tokens using this cookie name
var CSRF_TOKEN_COOKIE_NAME = 'bbCSRF';
//send csrf tokens using this request header name
var CSRF_TOKEN_HEADER_NAME = CSRF_TOKEN_COOKIE_NAME;

/**
 * Renders a page
 * @interface
 * @constructor
 */
var PageRenderer =  function(opts) {
};

/**
 * Starts the rendering process
 * @param rootEl
 * @param model
 * @param opts
 */
PageRenderer.prototype.render = function(rootEl, model, opts) {

    //options
    opts = opts || {};
    var logLevel = opts.logLevel || 'warn';
    var localContextRoot = opts.localContextRoot || '';
    var remoteContextRoot = opts.remoteContextRoot || '';
    var portalName = opts.portalName || 'anonymous-portal';
    var syncPreferences = opts.syncPreferences || [];

    //set up config
    var config = cxpWebApis.createConfiguration({
        contextRoot: localContextRoot,
        remoteContextRoot: remoteContextRoot,
        logStreams: this._createLogStreams(logLevel)
    });
    config.set('portalName', portalName);
    config.set('itemEngineLocator', {
        locate: function (itemModel, engineOpts) {
            return widgetEngineLocator(itemModel, engineOpts, localContextRoot);
        }
    });

    //CSRF
    var csrfTokenCookieValue = null; //TODO: where do we get a CSRF token from?
    if(csrfTokenCookieValue) {
        config.set('csrfToken', {
            name: CSRF_TOKEN_HEADER_NAME,
            value: csrfTokenCookieValue
        });
    }
    
    //set up renderer
    var renderer = cxpWebApis.getRenderer(config);
    // make sure you add the moc plugin before the BackbaseFormatPlugin
    renderer.addPlugin(mocPlugin(config.get('remoteContextRoot')));
    renderer.addPlugin(exposeChildrenPlugin());
    renderer.addPlugin(iceWorkaroundPlugin());
    renderer.addPlugin(new ReplaceConfigVarsPlugin({
        contextRoot: localContextRoot,
        remoteContextRoot: remoteContextRoot
    }, {
        full: true
    }));
    
    var bbPluginOpts = {
        contextRoot:       config.get('contextRoot'),
        remoteContextRoot: config.get('remoteContextRoot'),
        makeIncludedRefsAbsolute: true
    };
    var csrfToken = config.get('csrfToken');
    if(csrfToken) {
        bbPluginOpts.csrfToken = csrfToken;
    }
    renderer.addPlugin(new BackbaseFormatPlugin(bbPluginOpts));
    renderer.addPlugin(syncPreferenecsPlugin(syncPreferences));

    //expose CXP as a feature to widgets
    var cxpFeature = {
        name: 'cxp',
        config: config,
        render: renderer,
        model: cxpWebApis.getModel(config)
    };
    renderer.addPlugin(addFeaturePlugin([ cxpFeature.name ]));
    renderer.addFeature(cxpFeature);

    this._doRender(model, renderer, rootEl);
};

/**
 * Should return an array of browser-bunyan log streams.
 * @param opts
 * @private
 */
PageRenderer.prototype._createLogStreams = function(opts) {
    throw new Error('PageRenderer#_createLogStreams must be overridden.');
};

/**
 * Platform specific rendering part
 * @param model
 * @param renderer
 * @param rootEl
 * @private
 */
PageRenderer.prototype._doRender = function(model, renderer, rootEl) {
    throw new Error('PageRenderer#_doRender must be overridden.');
};

module.exports = PageRenderer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../plugins/add-feature-plugin":207,"../plugins/expose-children-plugin":208,"../plugins/ice-workaround-plugin":209,"../plugins/mobile-optimised-content-plugin":210,"../plugins/sync-preferences-plugin":211,"./webview-widget-engine":213,"backbase-widget-engine/src/plugins/backbase-format-plugin":101,"backbase-widget-engine/src/plugins/replace-config-vars-plugin":109,"cxp-web-apis":171}],213:[function(require,module,exports){
'use strict';

var webviewKit = require('backbase-widget-engine/src/exports/webview-kit');

module.exports = function getEngine(itemModel, engineOpts, contextRoot) {
    
    //this is a basic service locator to get a container or widget engine
    var EngineType = itemModel.children ? webviewKit.ContainerEngine : webviewKit.WidgetEngine;
    var engine =  new EngineType({
        log: engineOpts.log
    });
    engine.init({
        widgetUrl: engineOpts.widgetUrl,
        widgetEl: engineOpts.widgetEl,
        initialModel: itemModel,
        configVars: {
            contextRoot: contextRoot
        }
    });
    return engine;
};
},{"backbase-widget-engine/src/exports/webview-kit":100}]},{},[200]);
