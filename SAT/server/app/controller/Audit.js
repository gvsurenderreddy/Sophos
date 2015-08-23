var fs = require('fs'),
	mongoskin = require('mongoskin'),
	extend = require('node.extend');

// global defines
var TID_COLLNAME = 'tidlist';

// check methods
var CHECK_METHOD_UNSPEC = 0;
var CHECK_METHOD_CORS = 1;
var CHECK_METHOD_JSONP = 2;
var CHECK_METHOD_IMAGE = 3;

var gCheckMethods = [
	"UNSPEC",
	"CORS",
	"JSONP",
	"IMAGE"
];

var Audit = {
    getActiveURLS: function(req, res) {
	var opts = {};

		if (req.query.limit) {
			var myLimit = parseInt(req.query.limit, 10);
			opts = extend(opts, { limit: myLimit });
		}

		if (req.query.skip) {
			var mySkip = parseInt(req.query.skip, 10);
			opts = extend(opts, { skip: mySkip });
		}

		if (req.query.sort) {
			var mySortArr = [];
			var myMainSort = [];
			myMainSort.push(req.query.sort);

			if (req.query.desc == 'true') {
				myMainSort.push('desc');
			}
			else if (req.query.asc == 'true') {
				myMainSort.push('asc');
			}
			else {
				myMainSort.push('asc');
			}

			mySortArr.push(myMainSort);
		
			opts = extend(opts, { sort: mySortArr });
		}

		// set to default
		var selector = {};

		var myDb = mongoskin.db('mongodb://@localhost:27017/sat', {safe:true});
		try {
			myDb.collection(TID_COLLNAME).find(selector, opts).toArray(function(err, result) {
				if (err) {
					throw err;
				}

				if (result.length > 0) {
					var activeIdx = -1;
					// look for inactive batch after an active one
					for (var k = 0; k < result.length; k++) {
						if (result[k].active === true) {
							activeIdx = k;
							break;
						}
					}

					if (activeIdx == -1) {
						res.status(404).send('No active batch url list found.');
						return;					
					}

					var myActiveTbl = myDb.collection(result[activeIdx].tblname);

					opts = extend(opts, { _id: false });

					myActiveTbl.find(
						selector,
						opts
					).toArray(function(e, results){
						if (e) { 
							return next(e);
						}
		
						res.send(results);

						myDb.close();
					});
				}
				else {
					res.status(404).send('No entries found.');
					myDb.close();
				}
			});
		}
		catch(exc) {
			res.status(404).send('Failed to query batch url list tables [' + exc + ']');	
			myDb.close();
		}
    },

    getBotURLS: function(req, res) {
        fs.readFile(__dirname+'/../data/urllist.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getSSLList: function(req, res) {
        fs.readFile(__dirname+'/../data/urllistssl.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getMalwareList: function(req, res) {
        fs.readFile(__dirname+'/../data/urlmalware.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getResult: function(req, res) {
        fs.readFile(__dirname+'/../data/analyzedresults.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    }
};

module.exports = Audit;
