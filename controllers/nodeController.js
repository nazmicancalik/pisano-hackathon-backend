// var mongoose = require('mongoose');
var Node = require('../models/node');
var Util = require('../utils/Util');

exports.nodes_list = function(req,res) {
    Node.find({}, 'id name')
    .exec(function (err, list_nodes) {
        if (err) { 
          return next(err); 
        }
        //Successful, so send
        res.send(list_nodes);
    });
}

exports.node_detail = function(req,res,next) {
    Node.findById(req.params.id)
        .exec(function (err, node_details) {
            if (err) { 
              return next(err); 
            }
            //Successful, so send
            var sorted_list = Util.topologicalSort(node_details);

            Node.find({
                '_id': { $in: sorted_list }
            }, function(err, docs){
                res.send(docs);
            });
        });
}

exports.getNode = function(id,callback) {
    Node.findById(id)
        .select("-dependencies")
        .exec(function (err, node_details) {
            if (err) { 
              return next(err); 
            }
            //Successful, so invoke callback
            callback(node_details);
        });
}