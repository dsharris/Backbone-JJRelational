// Generated by CoffeeScript 1.6.3
var app, data, express, makeIdArray, nomo, url;

express = require('express');

url = require('url');

nomo = require('node-monkey').start();

app = express();

data = require('./dummy-data');

app.use(express["static"](__dirname + '/public'));

app.use(express.bodyParser());

app.get('/api/:type', function(req, res) {
  var collection, ids, model, out, type, _i, _len;
  type = req.params.type;
  collection = data[type];
  console.log('foobar');
  ids = req.query.ids;
  if (!ids) {
    out = collection;
  } else {
    ids = makeIdArray(ids);
    console.log(ids);
    out = [];
    for (_i = 0, _len = collection.length; _i < _len; _i++) {
      model = collection[_i];
      if (ids.indexOf(model.id) >= 0) {
        out.push(model);
      }
    }
  }
  if (out.length === 1) {
    out = out[0];
  }
  res.writeHead(200, {
    'Content-type': 'application/json'
  });
  return res.end(JSON.stringify(out));
});

app.post('/api/:type', function(req, res) {
  var atts, biggestId, item, type, _i, _len, _ref;
  type = req.params.type;
  biggestId = 0;
  _ref = data[type];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    if (item.id > 0) {
      biggestId = item.id;
    }
  }
  atts = req.body;
  atts.id = biggestId + 1;
  data[type].push(atts);
  res.writeHead(200, {
    'Content-type': 'application/json'
  });
  return res.end(JSON.stringify(atts));
});

makeIdArray = function(ids) {
  var i, id, _i, _len, _results;
  ids = ids.split(',');
  _results = [];
  for (i = _i = 0, _len = ids.length; _i < _len; i = ++_i) {
    id = ids[i];
    _results.push(ids[i] = parseInt(id));
  }
  return _results;
};

app.listen(3000);