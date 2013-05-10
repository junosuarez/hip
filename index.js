var http = require('http')
var Q = require('q')

var defaults = {
  name: 'Hip Server',
  port: 23080
}

function hip (requestHandler) {
  if (!(this instanceof hip)) {
    return new hip(requestHandler)
  }
  if (typeof requestHandler !== 'function'){
    throw new TypeError('requestHandler must be a function')
  }
  this.options = extend({}, defaults)
  this.requestHandler = requestHandler
}

hip.prototype.listen = function (port) {
  if (typeof port === 'number') {
    this.options.port = port
  } else if (typeof port === 'object') {
    extend(this.options, port)
  }
  var requestHandler = this.requestHandler
  http.createServer(function (req, res) {
    var hop = {req: req, res: res}
    Q(requestHandler(hop)).then(function (val) {
      res.end(val)
    }, function (e) {
      res.statusCode = 200
      res.end(e.toString())
    })
  }).listen(this.options.port)
  console.log(this.options.name + ' listening on ' + this.options.port)
  return this
}

function extend(o1, o2){
  Object.keys(o2).forEach(function (key) {
    o1[key] = o2[key]
  })
  return o1
}

module.exports = hip