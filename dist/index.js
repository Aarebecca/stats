function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * statistic repo
 */

var _require = require('child_process'),
  execSync = _require.execSync;
var core = require('@actions/core');
var https = require('https');
var fs = require('fs');
var repo = process.env.GITHUB_REPOSITORY;

/**
 * get today and last week in format YYYY-MM-DD
 */
function getRange() {
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  var format = function format(date) {
    return date.toISOString().split('T')[0];
  };
  return [format(lastWeek), format(today)];
}
var range = getRange();

/**
 * execute command in shell
 */
function exec(command) {
  return execSync(command).toString();
}

/**
 * request github api
 */
function request(_x) {
  return _request.apply(this, arguments);
}
/**
 * get commit count in range
 */
function _request() {
  _request = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(search) {
    var url, headers;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          url = "https://api.github.com/search/".concat(search);
          headers = {
            'User-Agent': 'request',
            Authorization: "Bearer ".concat(process.env.GITHUB_TOKEN)
          }; // make post request
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            https.get(url, {
              headers: headers
            }, function (res) {
              var data = '';
              res.on('data', function (chunk) {
                data += chunk;
              });
              res.on('end', function () {
                resolve(JSON.parse(data));
              });
            }).on('error', reject);
          }));
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _request.apply(this, arguments);
}
function getCommitCount() {
  var _range = _slicedToArray(range, 2),
    since = _range[0],
    until = _range[1];
  var command = "git rev-list --count --since=".concat(since, " --before=").concat(until, " HEAD");
  var result = exec(command);
  // format
  return parseInt(result.replace('\n', ''));
}
var _process$env = process.env,
  OWNER = _process$env.OWNER,
  REPO = _process$env.REPO;

/**
 * get open issue count in range
 */
function getOpenIssueCount() {
  return _getOpenIssueCount.apply(this, arguments);
}
/**
 * get closed issue count in range
 */
function _getOpenIssueCount() {
  _getOpenIssueCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _range2, since, until, open_issues;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _range2 = _slicedToArray(range, 2), since = _range2[0], until = _range2[1];
          _context2.next = 3;
          return request("issues?q=repo:".concat(repo, "+is:issue+is:open+created:").concat(since, "..").concat(until));
        case 3:
          open_issues = _context2.sent;
          return _context2.abrupt("return", open_issues.total_count);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _getOpenIssueCount.apply(this, arguments);
}
function getClosedIssueCount() {
  return _getClosedIssueCount.apply(this, arguments);
}
/**
 * get open pr count in range
 */
function _getClosedIssueCount() {
  _getClosedIssueCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var _range3, since, until, closed_issues;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _range3 = _slicedToArray(range, 2), since = _range3[0], until = _range3[1];
          _context3.next = 3;
          return request("issues?q=repo:".concat(repo, "+is:issue+is:closed+created:").concat(since, "..").concat(until));
        case 3:
          closed_issues = _context3.sent;
          return _context3.abrupt("return", closed_issues.total_count);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _getClosedIssueCount.apply(this, arguments);
}
function getOpenPRCount() {
  return _getOpenPRCount.apply(this, arguments);
}
/**
 * get closed pr count in range
 */
function _getOpenPRCount() {
  _getOpenPRCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var _range4, since, until, open_prs;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _range4 = _slicedToArray(range, 2), since = _range4[0], until = _range4[1];
          _context4.next = 3;
          return request("issues?q=repo:".concat(repo, "+is:pr+is:open+created:").concat(since, "..").concat(until));
        case 3:
          open_prs = _context4.sent;
          return _context4.abrupt("return", open_prs.total_count);
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _getOpenPRCount.apply(this, arguments);
}
function getClosedPRCount() {
  return _getClosedPRCount.apply(this, arguments);
}
/**
 * get added line count in range
 */
function _getClosedPRCount() {
  _getClosedPRCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var _range5, since, until, closed_prs;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _range5 = _slicedToArray(range, 2), since = _range5[0], until = _range5[1];
          _context5.next = 3;
          return request("issues?q=repo:".concat(repo, "+is:pr+is:closed+created:").concat(since, "..").concat(until));
        case 3:
          closed_prs = _context5.sent;
          return _context5.abrupt("return", closed_prs.total_count);
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _getClosedPRCount.apply(this, arguments);
}
function getAddedLineCount() {
  return _getAddedLineCount.apply(this, arguments);
}
/**
 * get deleted line count in range
 */
function _getAddedLineCount() {
  _getAddedLineCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var _range6, since, until, command, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _range6 = _slicedToArray(range, 2), since = _range6[0], until = _range6[1];
          command = "git log --since=".concat(since, " --before=").concat(until, " --pretty=tformat: --numstat | awk '{ add += $1 } END { print add }' -");
          result = exec(command);
          return _context6.abrupt("return", parseInt(result.replace('\n', '')));
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _getAddedLineCount.apply(this, arguments);
}
function getDeletedLineCount() {
  return _getDeletedLineCount.apply(this, arguments);
}
/**
 * get contributors' id in range
 */
function _getDeletedLineCount() {
  _getDeletedLineCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var _range7, since, until, command, result;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _range7 = _slicedToArray(range, 2), since = _range7[0], until = _range7[1];
          command = "git log --since=".concat(since, " --before=").concat(until, " --pretty=tformat: --numstat | awk '{ del += $2 } END { print del }' -");
          result = exec(command);
          return _context7.abrupt("return", parseInt(result.replace('\n', '')));
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _getDeletedLineCount.apply(this, arguments);
}
function getContributorIds() {
  return _getContributorIds.apply(this, arguments);
}
function _getContributorIds() {
  _getContributorIds = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var _range8, since, until, result, contributors;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _range8 = _slicedToArray(range, 2), since = _range8[0], until = _range8[1];
          _context8.next = 3;
          return request("commits?q=repo:".concat(repo, "+author-date:").concat(since, "..").concat(until));
        case 3:
          result = _context8.sent;
          contributors = Array.from(new Set(result.items.map(function (item) {
            return item.author.login;
          })));
          return _context8.abrupt("return", contributors.join(',') + " (".concat(contributors.length, ")"));
        case 6:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _getContributorIds.apply(this, arguments);
}
var Metric = [getCommitCount, getOpenIssueCount, getClosedIssueCount, getOpenPRCount, getClosedPRCount, getAddedLineCount, getDeletedLineCount, getContributorIds];
function stats() {
  return _stats.apply(this, arguments);
}
function _stats() {
  _stats = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    var metric,
      range,
      data,
      _data,
      commit_count,
      open_issue_count,
      closed_issue_count,
      open_pr_count,
      closed_pr_count,
      added_line_count,
      deleted_line_count,
      contributor_count,
      _range9,
      start_date,
      end_date,
      result,
      _args9 = arguments;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          metric = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : Metric;
          range = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : getRange();
          _context9.next = 4;
          return Promise.all(metric.map(function (fn) {
            return fn();
          }));
        case 4:
          data = _context9.sent;
          _data = _slicedToArray(data, 8), commit_count = _data[0], open_issue_count = _data[1], closed_issue_count = _data[2], open_pr_count = _data[3], closed_pr_count = _data[4], added_line_count = _data[5], deleted_line_count = _data[6], contributor_count = _data[7];
          _range9 = _slicedToArray(range, 2), start_date = _range9[0], end_date = _range9[1];
          result = {
            owner: OWNER,
            repo: REPO,
            start_date: start_date,
            end_date: end_date,
            commit_count: commit_count,
            open_issue_count: open_issue_count,
            closed_issue_count: closed_issue_count,
            open_pr_count: open_pr_count,
            closed_pr_count: closed_pr_count,
            added_line_count: added_line_count,
            deleted_line_count: deleted_line_count,
            contributor_count: contributor_count
          };
          return _context9.abrupt("return", result);
        case 9:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _stats.apply(this, arguments);
}
var nameMap = {
  owner: '所有者',
  repo: '仓库',
  metric: '指标',
  value: '详情',
  start_date: '开始日期',
  end_date: '结束日期',
  commit_count: '提交数',
  total_issue_count: '总 Issue 数',
  open_issue_count: '新增 Issue',
  closed_issue_count: '关闭 Issue',
  total_pr_count: '总 PR 数',
  open_pr_count: '新增 PR',
  closed_pr_count: '关闭 PR',
  added_line_count: '新增行数',
  deleted_line_count: '删除行数',
  total_line_count: '总行数',
  contributor_count: '贡献者数'
};
function exportResultToMarkdown(rp) {
  var header = "| ".concat(nameMap.metric, " | ").concat(nameMap.value, " |\n| --- | --- |\n");
  var content = Object.entries(rp).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    return "| ".concat(nameMap[key], " | ").concat(value, " |");
  }).join('\n');
  return header + content;
}
function submit(_x2) {
  return _submit.apply(this, arguments);
}
function _submit() {
  _submit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(md) {
    var saveToRepo, branchName, isBranchExist, file;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          try {
            // 获取保存到仓库的标志位
            saveToRepo = core.getInput('SAVE_TO_REPO');
            if (saveToRepo === 'true') {
              // 获取分支名称或使用默认值
              branchName = core.getInput('REPORT_BRANCH'); // 配置 Git 用户信息
              execSync('git config --global user.name "GitHub Actions"');
              execSync('git config --global user.email "actions@github.com"');

              // 判断分支是否存在，不存在则创建
              isBranchExist = execSync("git rev-parse --verify \"".concat(branchName, "\""), {
                stdio: 'ignore'
              }).error;
              if (isBranchExist) {
                execSync("git checkout --orphan \"".concat(branchName, "\""));
                execSync('git rm -rf .');
                execSync('git commit --allow-empty -m "Create empty branch"');
              } else {
                execSync("git checkout \"".concat(branchName, "\""));
              }
              file = range[1]; // 生成 Markdown 表格文件
              fs.writeFileSync("".concat(file, ".md"), md);

              // 提交 Markdown 表格文件
              execSync("git add ".concat(file, ".md"));
              execSync("git commit -m \"chore: Weekly stats (".concat(file, ").\""));
              execSync("git push origin \"".concat(branchName, "\""));
            }
          } catch (error) {
            core.setFailed(error.message);
          }
        case 1:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _submit.apply(this, arguments);
}
function run() {
  return _run.apply(this, arguments);
}
function _run() {
  _run = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
    var rp, content;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return stats();
        case 2:
          rp = _context11.sent;
          content = exportResultToMarkdown(rp);
          submit(content);
        case 5:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return _run.apply(this, arguments);
}
run();