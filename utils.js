'use strict';

exports.__esModule = true;
exports.seq = exports.transduce = exports.into = exports.objectReducer = exports.arrayReducer = exports.scream = exports.shout = exports.toUpper = exports.pushReducer = exports.doubleAndEven = exports.doubleTheNumber = exports.evenOnly = exports.filter = exports.map = exports.compose = exports.arrayofRandoms = exports.timeIt = undefined;

var _lodash = require('lodash');

var timeIt = exports.timeIt = function timeIt(label, fn) {
    console.time(label);
    fn();
    console.timeEnd(label);
};

var arrayofRandoms = exports.arrayofRandoms = function arrayofRandoms(randomCeil) {
    return function (length) {
        return Array.from({ length: length }, function (v, i) {
            return Math.floor(Math.random() * randomCeil);
        });
    };
};

var compose = exports.compose = function compose() {
    for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
        functions[_key] = arguments[_key];
    }

    return functions.reduce(function (accumulation, fn) {
        return function () {
            return accumulation(fn.apply(undefined, arguments));
        };
    }, function (x) {
        return x;
    });
};

var map = exports.map = function map(xf) {
    return function (reducer) {
        return function (accumulation, value) {
            return reducer(accumulation, xf(value));
        };
    };
};

var filter = exports.filter = function filter(predicate) {
    return function (reducer) {
        return function (accumulation, value) {
            if (predicate(value)) return reducer(accumulation, value);
            return accumulation;
        };
    };
};

var evenOnly = exports.evenOnly = function evenOnly(number) {
    return number % 2 === 0;
};
var doubleTheNumber = exports.doubleTheNumber = function doubleTheNumber(number) {
    return number * 2;
};
var doubleAndEven = exports.doubleAndEven = compose(map(doubleTheNumber), filter(evenOnly));
var pushReducer = exports.pushReducer = function pushReducer(accumulation, value) {
    accumulation.push(value);
    return accumulation;
};
var toUpper = exports.toUpper = function toUpper(str) {
    return str.toUpperCase();
};
var shout = exports.shout = function shout(str) {
    return str + '!!';
};
var scream = exports.scream = function scream(str) {
    return toUpper(shout(str));
};

var arrayReducer = exports.arrayReducer = function arrayReducer(array, value) {
    array.push(value);
    return array;
};

// and our object reducer will perform a shallow merge with object.assign.
var objectReducer = exports.objectReducer = function objectReducer(obj, value) {
    return Object.assign(obj, value);
};

var into = exports.into = function into(to, xf, collection) {
    if (Array.isArray(to)) return transduce(xf, arrayReducer, to, collection);else if ((0, _lodash.isPlainObject)(to)) return transduce(xf, objectReducer, to, collection);
    throw new Error('into only supports arrays and objects as `to`');
};

var transduce = exports.transduce = function transduce(xf /** could be composed **/, reducer, seed, _collection) {

    // apply our reducer transform
    var transformedReducer = xf(reducer);
    // for every value, send the current value and the new total in, function returns a new total
    var accumulation = seed;

    var collection = (0, _lodash.isPlainObject)(_collection) ? (0, _lodash.entries)(_collection) : _collection;

    for (var _iterator = collection, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var value = _ref;

        accumulation = transformedReducer(accumulation, value); /*?*/
    }

    return accumulation;
};

var seq = exports.seq = function seq(xf, collection) {
    if (Array.isArray(collection)) return transduce(xf, arrayReducer, [], collection);
    // and for an object it will be an empty object
    else if ((0, _lodash.isPlainObject)(collection)) return transduce(xf, objectReducer, {}, collection);else if (collection['@@transducer/step']) {
            var init = collection['@@transducer/init'] ? collection['@@transducer/init']() : collection.constructor();
            return transduce(xf, collection['@@transducer/step'], init, collection);
        }
    throw new Error('unsupported data type');
};