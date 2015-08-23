//////////////////////////////////////////////////////////////////////////////
// rxapi_server.js - main entry for rest service
//////////////////////////////////////////////////////////////////////////////
var express = require('express'),
	mongoskin = require('mongoskin'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	path = require('path')/*,
	logger = require('morgan')*/;

// jquery like extend
var extend = require('node.extend');

//////////////////////////////////////////////////////////////////////////////
// constants
//////////////////////////////////////////////////////////////////////////////
var REST_SERVER_PORT = 50888;

var RESULT_SUCCESS = {
	msg: 'success'
};

var RESULT_FAILURE = {
	msg: 'error'
};

var TID_COLLNAME = 'tidlist';
var BATCH_COLLNAME_PREFIX = 'batch_';
var BATCH_ENTRIES_TO_KEEP = 5;

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

// init the express object
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
//app.use(logger());

// init the database connection
var gMyDatabase = mongoskin.db('mongodb://@localhost:27017/sat', {safe:true});
var ID_HELPER = mongoskin.helper.toObjectID;

app.param('collName', function(req, res, next, collName){
	req.collName = collName;
	req.table = gMyDatabase.collection(collName);
	return next();
});

//////////////////////////////////////////////////////////////////////////////
// GET handler - default root path
//////////////////////////////////////////////////////////////////////////////
app.get('/', function(req, res, next) {
	res.send('REST Server implementation');
});

//////////////////////////////////////////////////////////////////////////////
// GET handler - get the list
//////////////////////////////////////////////////////////////////////////////
app.get('/rxapi/:collName', function(req, res, next) {
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

	// get the collection name
	var myCollName = req.collName;

	// set to default
	var selector = {};

	// filters for url collection
	if (myCollName == 'url') {
		if (req.query.audit_type && !isNaN(req.query.audit_type)) {
			var auditTypeSelector = { audit_type: parseInt(req.query.audit_type) };

			if (!selector.$and) {
				selector.$and = [];
			}
			selector.$and.push(auditTypeSelector);
		}

		if (req.query.gid && !isNaN(req.query.gid)) {
			var gidSelector = { gid: parseInt(req.query.gid) };

			if (!selector.$and) {
				selector.$and = [];
			}
			selector.$and.push(gidSelector);
		}

		if (req.query.jsonp == 'true') {
			var jsonpSelector = { $or: [{ jsonp: true }, { jsonp: "true" }] };

			if (!selector.$and) {
				selector.$and = [];
			}
			selector.$and.push(jsonpSelector);
		}

		if (req.query.cors == 'true') {
			var corsSelector = { $or: [{ cors: true }, { cors: "true" }] };

			if (!selector.$and) {
				selector.$and = [];
			}
			selector.$and.push(corsSelector);
		}
	}
	
	req.table.find(
		selector,
		opts
	).toArray(function(e, results){
			if (e) { 
				return next(e);
			}
			
			res.send(results);
		}
	)
});

//////////////////////////////////////////////////////////////////////////////
// POST handler - add multiple
//////////////////////////////////////////////////////////////////////////////
app.post('/rxapi/:collName', function(req, res, next) {
	req.table.insert(
		req.body, 
		{}, 
		function(e, results){
			if (e) {
				return next(e);
			}
			
			res.send(results);
		}
	);
})

//////////////////////////////////////////////////////////////////////////////
// GET handler - get single by ID
//////////////////////////////////////////////////////////////////////////////
app.get('/rxapi/:collName/:id', function(req, res, next) {
	req.table.findOne(
		{
			_id: ID_HELPER(req.params.id)
		}, 
		function(e, result){
			if (e) {
				return next(e);
			}
			
			res.send(result);
		}
	)
})

//////////////////////////////////////////////////////////////////////////////
// PUT handler - update by ID
//////////////////////////////////////////////////////////////////////////////
app.put('/rxapi/:collName/:id', function(req, res, next) {
	req.table.update(
		{
			_id: ID_HELPER(req.params.id)
		},
		{
			$set: req.body
		},
		{
			safe: true, 
			multi: false
		}, 
		function(e, result){
			if (e) {
				return next(e);
			}
			
			res.send((result === 1) ? RESULT_SUCCESS : RESULT_FAILURE);
		}
	);
});

//////////////////////////////////////////////////////////////////////////////
// DELETE handler - remove by ID
//////////////////////////////////////////////////////////////////////////////
app.delete('/rxapi/:collName/:id', function(req, res, next) {
	req.table.remove(
		{
			_id: ID_HELPER(req.params.id)
		}, 
		function(e, result){
			if (e) {
				return next(e);
			}
					
			res.send((result === 1) ? RESULT_SUCCESS : RESULT_FAILURE);
		}
	);
});

//////////////////////////////////////////////////////////////////////////////
// DELETE all handler
//////////////////////////////////////////////////////////////////////////////
app.delete('/rxapi/:collName', function(req, res, next) {
	req.table.remove(
		{}, 
		function(e, result){
			if (e) {
				return next(e);
			}
					
			res.send(RESULT_SUCCESS);
		}
	);
});

//////////////////////////////////////////////////////////////////////////////
// URL List GET handler - get by ID
//////////////////////////////////////////////////////////////////////////////
/*
app.get('/urllist/:id', function(req, res, next) {
	//NOTE: this is assuming that the urllist JSON repository is at './urllist/' directory
	var absPath = path.join(__dirname, 'urllist/urllist_' + req.params.id + '.json');

	try {
		//console.log(absPath + ' is found.');
		
		var fileStat = fs.statSync(absPath);
		
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Content-Length': fileStat.size
		});

		var rdStream = fs.createReadStream(absPath);
		res.on('error', function(err) {
			rdStream.end();
		});

		rdStream.pipe(res);
	}
	catch(exc) {
		//console.log(absPath + ' not found.');
		res.status(404).send('The requested resource is not found. Please check your request URL.');
	}
})
*/

//////////////////////////////////////////////////////////////////////////////
// GET handler for listing active batch url entries
//////////////////////////////////////////////////////////////////////////////
app.get('/urllist/active', function(req, res, next) {
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

	try {
		gMyDatabase.collection(TID_COLLNAME).find(selector, opts).toArray(function(err, result) {
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

				var myActiveTbl = gMyDatabase.collection(result[activeIdx].tblname);

				opts = extend(opts, { _id: false });

				myActiveTbl.find(
					selector,
					opts
				).toArray(function(e, results){
					if (e) { 
						return next(e);
					}
		
					res.send(results);
				});
			}
			else {
				res.status(404).send('No entries found.');
			}
		});
	}
	catch(exc) {
		res.status(404).send('Failed to query batch url list tables.');	
	}
});

//////////////////////////////////////////////////////////////////////////////
// 
//////////////////////////////////////////////////////////////////////////////
app.post('/urllist', function(req, res, next) {
	console.log(req.body); 

	var myDirName = '';
	if (req.query.dirname) {
		myDirName = req.query.dirname;
		if (myDirName[myDirName.length-1] != '/') {
			myDirName += '/';
		}
	}

	// transaction ID obtained from the current time in msec since 1970
	var tid = (new Date()).getTime();

	var myTidTable = gMyDatabase.collection(TID_COLLNAME);

	// get the current count
	myTidTable.count(function(err, count) {
		//console.log('There are ' + count + ' batch(es) in the database');
		if (err) {
			res.status(500).send(err);
			return;
		}

		// check if we reached max entries to keep
		if (count >= BATCH_ENTRIES_TO_KEEP) {
			//myTidTable.remove(function(e, result){});

			// find earliest and remove
			myTidTable.findOne({ active: false }, function(e, result){
				//console.log('Removing ' + JSON.stringify(result));

				// delete the earliest collection (clean up)
				gMyDatabase.collection(result.tblname).drop();
				
				// remove the entry in the tid table
				myTidTable.remove({
					_id: ID_HELPER(result._id)
				}, function(err, result2) {
					if (!err) console.log('Removing oldest batch url list [%s]', result.tblname);
				});
			});
		}

		var tblName = BATCH_COLLNAME_PREFIX + tid;

		var newEntry = {
			tblname: tblName,
			ts: tid,
			active: false,
			checked: false
		};

		//console.log('inserting [%s]', JSON.stringify(newEntry));

		// insert new table entry 
		myTidTable.insert(
			newEntry, 
			{}, 
			function(e, results){
				console.log('Added new batch url list [%s]', results[0].tblname);
			}
		);

		// looking for files
		console.log('Looking for input files from [%s]', myDirName);

		var inFiles = req.body;
		for (var k = 0; k < inFiles.length; k++) {
			processInputFile(inFiles[k].fname, myDirName, inFiles[k].type, tblName);
		}

		res.status(200).send('OK');
	});

})

//////////////////////////////////////////////////////////////////////////////
// Helper functions
//////////////////////////////////////////////////////////////////////////////

function getCheckMethodByType(type)
{
	var method;

	switch(type) {
		case 1:
		case 7:
			method = CHECK_METHOD_CORS;
			break;
			
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			method = CHECK_METHOD_IMAGE;
			break;

		default:
			method = CHECK_METHOD_UNSPEC;
			break;
	}

	return method;
}

function processInputFile(fname, dirname, type, tblName)
{
	var inFileName = dirname + fname;
	var checkMethod = getCheckMethodByType(type);

	//console.log('Processing file ' + inFileName + ' to table ' + tblName + ' method ' + gCheckMethods[checkMethod]);

	try {
		var fileStat = fs.statSync(inFileName);

		//console.log(inFileName + ' is found.');

		var myBatchTable = gMyDatabase.collection(tblName);
		
		function readLines(inFile, cbFunc) 
		{
			var remaining = '';

			inFile.on('data', function(data) {
				remaining += data;
				var index = remaining.indexOf('\n');
				var last  = 0;
				while (index > -1) {
					var line = remaining.substring(last, index);
					last = index + 1;
					cbFunc(line);
					index = remaining.indexOf('\n', last);
				}

				remaining = remaining.substring(last);
			});

			inFile.on('end', function() {
				if (remaining.length > 0) {
					cbFunc(remaining);
				}
			});
		}

		function readLineCb(data) 
		{
			//console.log('Line: ' + data + ' will be inserted to ' + tblName + ' using method ' + gCheckMethods[checkMethod]);

			var newEntry = {
				url: data,
				method: checkMethod,
				compliant: -1
			};

			// insert new table entry 
			myBatchTable.insert(
				newEntry, 
				{}, 
				function(e, results){
					//console.log('Added [%s - %d]', results[0].url, results[0].method);
				}
			);
		}

		var inFile = fs.createReadStream(inFileName);
		readLines(inFile, readLineCb);
	}
	catch(exc) {
		console.log(inFileName + ' not found.');
	}
}

//////////////////////////////////////////////////////////////////////////////
// Default handler
//////////////////////////////////////////////////////////////////////////////
app.use(function(req, res, next) {
	res.status(404).send('The requested resource is not found. Please check your request URL.');
});

//////////////////////////////////////////////////////////////////////////////
// Start the node/express server
//////////////////////////////////////////////////////////////////////////////
var gMyServer = app.listen(REST_SERVER_PORT, function(){
	var host = gMyServer.address().address;
	var port = gMyServer.address().port;

	console.log('REST service is running at http://%s:%s', host, port);	
});

