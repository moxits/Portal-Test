var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var chartModel = require('../models/chart');
var socketio = require('../socketio');

/* GET users listing. */
router.post('/new/:chartName', function(req, res, next) {
  var name = req.params.chartName
  console.log(name);
  var newChart = new chartModel(req.params.name);
  newChart.name = name;
  newChart.save(function(err,chart){
    if (err){
      console.error(err);
      return res.send('ERROR');
    }
    var empty = [];
    res.render('home',{title:name,filled:empty});
  });
});

router.get('/:chartName',function(req,res,next){
  var name = req.params.chartName;
  chartModel.findOne({name:name},function(err,chart){
    if (chart){
  
      res.render('home',{title:name,filled:chart.filled});
    } 
    else{
      var newChart = new chartModel(req.params.name);
      newChart.name = name;
      newChart.save(function(err,chart){
        if (err){
          console.error(err);
          return res.send('ERROR');
        }
        var empty = [];
        res.render('home',{title:name,filled:empty});
      });
    }
  })
});

router.post('/newClick/:chartName',function(req,res,next){
  var name = req.params.chartName;
  chartModel.findOne({name:name},function(err,chart){
    found = chart;
    found.filled.push(req.body);
    if (socketio.sockets()[name]){
      socketio.sockets()[name].emit('newClick',{
          row:req.body.row,
          col:req.body.col,
          color:req.body.color
        })
    }
  }).then(function(){
    found.save(function(err,saved){
      if(err) console.error(err);
      
      })
      res.send(saved);
    })
  });
router.get('/filled/:chartName',function(req,res,next){
  var name = req.params.chartName;
  chartModel.findOne({name:name},function(err,chart){
    if (chart){
      res.send(chart.filled);
    }
 })
});


module.exports = router;
