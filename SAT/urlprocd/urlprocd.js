//////////////////////////////////////////////////////////////////////////////
// urlprocd.js - main entry for url processor daemon
//////////////////////////////////////////////////////////////////////////////
// required modules
var sleep = require('sleep'),
	mongoskin = require('mongoskin'),
	ObjectId = require('mongodb').ObjectID,
    async = require('async'),
	http = require('http'),
	https = require('https'),
	url = require('url');

//////////////////////////////////////////////////////////////////////////////
// constants
//////////////////////////////////////////////////////////////////////////////
var SIMULATED_ORIGIN = 'http://crowbarsecurity.azurewebsites.net';
var SIMULATED_CALLBACK_FUNCTION_NAME = 'myCbFunc';

// database connection parameters
var DB_HOST = '127.0.0.1';
var DB_PORT = 27017;
var DB_NAME = '/sat'; 
var ID_HELPER = mongoskin.helper.toObjectID;

var CHECK_INTERVAL = 10; // seconds

var TID_COLLNAME = 'tidlist';

// check methods
var CHECK_METHOD_UNSPEC = 0;
var CHECK_METHOD_CORS = 1;
var CHECK_METHOD_JSONP = 2;
var CHECK_METHOD_IMAGE = 3;

// compliant
var IS_COMPLIANT = 1;
var NOT_COMPLIANT = 0;

// request timeout
var HTTP_REQ_TIMEOUT = 3; //secs

//////////////////////////////////////////////////////////////////////////////
// globals
//////////////////////////////////////////////////////////////////////////////

// open the database
var gMyDatabase = mongoskin.db('mongodb://' + DB_HOST + ':' + DB_PORT + DB_NAME, { safe: true });
//var gMyDatabase = mongoskin.db('mongodb://@localhost:27017/sat', {safe:true});
var ID_HELPER = mongoskin.helper.toObjectID;

var gBusyProcessing = false;

var gCheckMethods = [
	"UNSPEC",
	"CORS",
	"JSONP",
	"IMAGE"
];

var gCurrentReq = null;
var gLastPendingReq = null;

////////////////////////////////////////////////////////////////////////////////////////////////////
// Busy handling
////////////////////////////////////////////////////////////////////////////////////////////////////

function setBusy()
{
	gBusyProcessing = true;
	console.log('Busy');
}

function clearBusy()
{
	gBusyProcessing = false;
	console.log('Not Busy');
}

function isBusy()
{
	return gBusyProcessing;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplCORSComplianceCB - callback function for CORS check result
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplCORSComplianceCB(error, urlArray, collname, id, urlStr, statusCode, headers, result, cbContext)
{
	// get the current time in seconds since 1970
	var currTs = Math.floor((new Date().getTime()) / 1000);
	//console.log(currTs);

	if (error == null) {
		var isCorsCompliant = false;

		// result contains the response body
		//console.log('##############################################################');
		//console.log('Got http response, length = %d bytes', result.length);
		//console.log('##############################################################');

		// http response code in successful range, determine to be in the 2xx code range
		if (Math.floor(statusCode / 200) == 1) {
			// iterate on each header attribute and its value
			// headers is an array of field names and their values
			for (var attrname in headers) {
				// this line prints all the HTTP response headers from the server
				//console.log(attrname + ' = ' + headers[attrname]);

				// to determine if this is a CORS compliant, we detect if there is a 
				// 'access-control-allow-origin' header and the value either be '*' or our
				// simulated ORIGIN from the request headers
				if ((attrname.toLowerCase() == 'access-control-allow-origin') && 
					((headers[attrname] == '*') || (headers[attrname] == SIMULATED_ORIGIN))) {
					isCorsCompliant = true;
					break;
				}
			}

			//console.log('Got response code [%d] from URL [%s], this site is CORS %s', 
			//	statusCode,
			//	urlStr,
			//	isCorsCompliant ? 'compliant' : 'non-compliant');

			//console.log('Updating id [%s] with ts value [%d]', id, currTs);

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: isCorsCompliant ? IS_COMPLIANT : NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
		else {
			// non 2xx response code, most like the URL is not available
			//console.log('GOT response code [%d] from URL [%s], likely not available', 
			//	statusCode,
			//	urlStr);

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
	}
	else {
		// display the error message
		//console.error('Got HTTP Error [%s] from URL [%s], URL not available', 
		//	error.message,
		//	urlStr);

		// update the entry
		gMyDatabase.collection(collname).updateById(
			id, 
			{$set: { compliant: NOT_COMPLIANT } },
			function(error, count){
				//console.log('Updated = ' + count);
			});
	}

	if (urlArray.length == 0) {
		//console.log(cbContext);
		updateBatchListCb(cbContext._newBatch, cbContext._activeBatch);
	}

	processSingleUrl(urlArray, collname, cbContext);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplCheckCORSCompliance
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplCheckCORSCompliance(urlArray, collname, id, urlStr, cb, cbContext)
{
	var myUrl = url.parse(urlStr);
	//console.log(myUrl);
	var isSecure = (myUrl.protocol == 'https:');

	var options = {
        hostname: myUrl.hostname,
		port: (myUrl.port ? myUrl.port : (isSecure ? 443 : 80)),
        path: myUrl.path,
		// use OPTIONS for pre-flight
		method: 'OPTIONS',
		headers: {
			// user agent simulated coming from a firefox browser
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.5',
			'Accept-Encoding': 'gzip, deflate',
			// origin simulated to be coming from http://crowbarsecurity.azurewebsites.net
			'Origin': SIMULATED_ORIGIN,
			'Access-Control-Request-Method': 'GET',
			'Access-Control-Request-Headers': 'x-requested-with'
		}
	};

	// if this is an https connection, we don't care who signed the cert
	if (isSecure) {
		options.rejectUnauthorized = false;
	}

	var protoObj = isSecure ? https : http;

	// fire an http request
    var req = protoObj.request(options, function(res) {
        // support multi-byte chars
        res.setEncoding('utf8');

        // continue appending to complete the response body
        var body = '';
        res.on('data', function(d) {
            body += d;
        });

        // do whatever we want with the response once it's done
        res.on('end', function() {
            // pass the relevant data back to the callback
			if (cb && typeof cb === 'function') {
		        cb(null, urlArray, collname, id, urlStr, res.statusCode, res.headers, body, cbContext);
			}
        });
    }).on('error', function(err) {
		if (cb && typeof cb === 'function') {
	        cb(err, urlArray, collname, id, urlStr, 0, [], '', cbContext);
		}
    });

	req.on('socket', function (socket) {
		socket.setTimeout(HTTP_REQ_TIMEOUT * 1000);  
		socket.on('timeout', function() {
		    req.abort();
			console.log('Timed out... Aborted check for [%s]', urlStr);
		});
	});

	gCurrentReq = req;

	req.end();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplJSONPComplianceCB - callback function for JSONP check result
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplJSONPComplianceCB(error, urlArray, collname, id, urlStr, statusCode, headers, result, cbContext)
{
	// get the current time in seconds since 1970
	var currTs = Math.floor((new Date().getTime()) / 1000);
	//console.log(currTs);

	if (error == null) {
		var isJsonPCompliant = false;

		// result contains the response body
		//console.log('##############################################################');
		//console.log('Got http response, length = %d bytes', result.length);
		//console.log('##############################################################');

		// http response code in successful range, determine to be in the 2xx code range
		if (Math.floor(statusCode / 200) == 1) {
			// iterate on each header attribute and its value
			// headers is an array of field names and their values
			for (var attrname in headers) {
				//console.log(attrname + ' = ' + headers[attrname]);
			}

			// determine if JSONP compliant by checking the response body
			// and see if the callback function name function is reflected back
			// in the response body 
			if (result.indexOf(SIMULATED_CALLBACK_FUNCTION_NAME) >= 0) {
				isJsonPCompliant = true;
			}

			//console.log('Got response code [%d] from URL [%s], this site is JSONP %s', 
			//	statusCode,
			//	urlStr,
			//	isJsonPCompliant ? 'compliant' : 'non-compliant');

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: isJsonPCompliant ? IS_COMPLIANT : NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
		else {
			// non 2xx response code, most like the URL is not available
			//console.log('GOT response code [%d] from URL [%s], likely not available', 
			//	statusCode,
			//	urlStr);

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
	}
	else {
        // display the error message
        //console.error('Got HTTP Error [%s] from URL [%s], URL not available', 
		//	error.message,
		//	urlStr);

		// update the entry
		gMyDatabase.collection(collname).updateById(
			id, 
			{$set: { compliant: NOT_COMPLIANT } },
			function(error, count){
				//console.log('Updated = ' + count);
			});
	}

	if (urlArray.length == 0) {
		updateBatchListCb(cbContext._newBatch, cbContext._activeBatch);
	}

	processSingleUrl(urlArray, collname, cbContext);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplCheckJSONPCompliance
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplCheckJSONPCompliance(urlArray, collname, id, urlStr, cb, cbContext)
{
	var myUrl = url.parse(urlStr);
	//console.log(myUrl);
	var isSecure = (myUrl.protocol == 'https:');

	var modifiedPath = myUrl.path;
	// should we add a '?' or '&'
	if (myUrl.path.indexOf('?') >= 0) {
		modifiedPath += '&callback=' + SIMULATED_CALLBACK_FUNCTION_NAME;
	}
	else {
		modifiedPath += '?callback=' + SIMULATED_CALLBACK_FUNCTION_NAME;
	}

	var options = {
        hostname: myUrl.hostname,
		port: (myUrl.port ? myUrl.port : (isSecure ? 443 : 80)),
        path: modifiedPath,
		method: 'GET',
		headers: {
			// user agent simulated coming from a firefox browser
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.5',
			'Accept-Encoding': 'gzip, deflate',
			'Referrer': SIMULATED_ORIGIN
		}
	};

	// if this is an https connection, we don't care who signed the cert
	if (isSecure) {
		options.rejectUnauthorized = false;
	}

	var protoObj = isSecure ? https : http;

	// fire an http request
    var req = protoObj.request(options, function(res) {
        // support multi-byte chars
        res.setEncoding('utf8');
 
        // continue appending to complete the response body
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
 
        // do whatever we want with the response once it's done
        res.on('end', function() {
            // pass the relevant data back to the callback
			if (cb && typeof cb === 'function') {
		        cb(null, urlArray, collname, id, urlStr, res.statusCode, res.headers, body, cbContext);
			}
        });
    }).on('error', function(err) {
		if (cb && typeof cb === 'function') {
	        cb(err, urlArray, collname, id, urlStr, 0, [], '', cbContext);
		}
    });

	req.on('socket', function (socket) {
		socket.setTimeout(HTTP_REQ_TIMEOUT * 1000);  
		socket.on('timeout', function() {
		    req.abort();
			console.log('Timed out... Aborted check for [%s]', urlStr);
		});
	});

	gCurrentReq = req;

	req.end();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplIMGComplianceCB - callback function for IMG check result
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplIMGComplianceCB(error, urlArray, collname, id, urlStr, statusCode, headers, result, cbContext)
{
	// get the current time in seconds since 1970
	var currTs = Math.floor((new Date().getTime()) / 1000);
	//console.log(currTs);

	if (error == null) {
		var isImgCompliant = false;

		// result contains the response body
		//console.log('##############################################################');
		//console.log('Got http response, length = %d bytes', result.length);
		//console.log('##############################################################');

		// http response code in successful range, determine to be in the 2xx code range
		if (Math.floor(statusCode / 200) == 1) {
			// iterate on each header attribute and its value
			// headers is an array of field names and their values
			for (var attrname in headers) {
				//console.log(attrname + ' = ' + headers[attrname]);
			}

			isImgCompliant = true;

			//console.log('Got response code [%d] from URL [%s], this site is Image %s', 
			//	statusCode,
			//	urlStr,
			//	isImgCompliant ? 'compliant' : 'non-compliant');

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: isImgCompliant ? IS_COMPLIANT : NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
		else {
			// non 2xx response code, most like the URL is not available
			//console.log('GOT response code [%d] from URL [%s], likely not available', 
			//	statusCode,
			//	urlStr);

			// update the entry
			gMyDatabase.collection(collname).updateById(
				id, 
				{$set: { compliant: NOT_COMPLIANT } },
				function(error, count){
					//console.log('Updated = ' + count);
				});
		}
	}
	else {
        // display the error message
        //console.error('Got HTTP Error [%s] from URL [%s], URL not available', 
		//	error.message,
		//	urlStr);

		// update the entry
		gMyDatabase.collection(collname).updateById(
			id, 
			{$set: { compliant: NOT_COMPLIANT } },
			function(error, count){
				//console.log('Updated = ' + count);
			});
	}

	if (urlArray.length == 0) {
		updateBatchListCb(cbContext._newBatch, cbContext._activeBatch);
	}

	processSingleUrl(urlArray, collname, cbContext);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// cmplCheckIMGCompliance
////////////////////////////////////////////////////////////////////////////////////////////////////
function cmplCheckIMGCompliance(urlArray, collname, id, urlStr, cb, cbContext)
{
	var myUrl = url.parse(urlStr);
	//console.log(myUrl);
	var isSecure = (myUrl.protocol == 'https:');

	var modifiedPath = '/favicon.ico';

	var options = {
        hostname: myUrl.hostname,
		port: (myUrl.port ? myUrl.port : (isSecure ? 443 : 80)),
        path: modifiedPath,
		method: 'GET',
		headers: {
			// user agent simulated coming from a firefox browser
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'en-US,en;q=0.5',
			'Accept-Encoding': 'gzip, deflate',
			'Referrer': SIMULATED_ORIGIN
		}
	};

	// if this is an https connection, we don't care who signed the cert
	if (isSecure) {
		options.rejectUnauthorized = false;
	}

	var protoObj = isSecure ? https : http;

	// fire an http request
    var req = protoObj.request(options, function(res) {
        // support multi-byte chars
        res.setEncoding('utf8');
 
        // continue appending to complete the response body
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
 
        // do whatever we want with the response once it's done
        res.on('end', function() {
            // pass the relevant data back to the callback
			if (cb && typeof cb === 'function') {
		        cb(null, urlArray, collname, id, urlStr, res.statusCode, res.headers, body, cbContext);
			}
        });
    }).on('error', function(err) {
		if (cb && typeof cb === 'function') {
	        cb(err, urlArray, collname, id, urlStr, 0, [], '', cbContext);
		}
    });

	req.on('socket', function (socket) {
		socket.setTimeout(HTTP_REQ_TIMEOUT * 1000);  
		socket.on('timeout', function() {
		    req.abort();
			console.log('Timed out... Aborted check for [%s]', urlStr);
		});
	});

	gCurrentReq = req;

	req.end();
}

//////////////////////////////////////////////////////////////////////////////
// update the batch status list
//////////////////////////////////////////////////////////////////////////////

function updateBatchListCb(newBatch, activeBatch)
{
	if (newBatch) {
		gMyDatabase.collection(TID_COLLNAME).updateById(
			newBatch._id.toString(), 
			{$set: { active: true, checked: true } },
			function(error, count){
				//console.log('Updated = ' + count);
		});

		console.log(newBatch.tblname + ' is now active.');
	}

	if (activeBatch) {
		gMyDatabase.collection(TID_COLLNAME).updateById(
			activeBatch._id.toString(), 
			{$set: { active: false } },
			function(error, count){
				//console.log('Updated = ' + count);
		});

		console.log(activeBatch.tblname + ' is deactivated.');
	}
}

//////////////////////////////////////////////////////////////////////////////
// processing the batch url list
//////////////////////////////////////////////////////////////////////////////

function processSingleUrl(urlArray, tblname, cbContext)
{
	if (urlArray.length == 0) {
		console.log('Done processing!!!');
		clearBusy();
		return;
	}
	else {
		console.log('URLs to process [%d]', urlArray.length);
	}

	var urlInst = urlArray.shift();

	switch(urlInst.method) {
		case CHECK_METHOD_CORS:
			console.log('url [%s] is using CORS method', urlInst.url);
			cmplCheckCORSCompliance(urlArray, tblname, urlInst._id.toString(), urlInst.url, cmplCORSComplianceCB, cbContext);
			break;
		case CHECK_METHOD_JSONP:
			console.log('url [%s] is using JSONP method', urlInst.url);
			cmplCheckJSONPCompliance(urlArray, tblname, urlInst._id.toString(), urlInst.url, cmplJSONPComplianceCB, cbContext);
			break;
		case CHECK_METHOD_IMAGE:
			console.log('url [%s] is using IMAGE method', urlInst.url);
			cmplCheckIMGCompliance(urlArray, tblname, urlInst._id.toString(), urlInst.url, cmplIMGComplianceCB, cbContext);
			break;
		default:
			console.log('Error: Invalid method [%d] for url [%s]', urlInst.method, urlInst.url);
			processSingleUrl(urlArray, tblName, cbContext);
			break;
	}
}

//////////////////////////////////////////////////////////////////////////////
// processing the batch url list
//////////////////////////////////////////////////////////////////////////////

function processBatchUrlColl(newBatch, activeBatch)
{
	// processing
	console.log('Processing ' + newBatch.tblname + ' at timestamp ' + newBatch.ts);
	console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

	setBusy();

	var batchColl = gMyDatabase.collection(newBatch.tblname);

	try {
		var cbContext = {	
			_newBatch: newBatch,
			_activeBatch: activeBatch
		};

		batchColl.find().toArray(function(err, result) {
			if (err) {
				throw err;
			}

			//console.log(result);
			//console.log('Table Name - ' + newBatch.tblname);
			processSingleUrl(result, newBatch.tblname, cbContext);
		});
	}
	catch(exc) {
		clearBusy();
	}

	//console.log('###################################################################');
}

//////////////////////////////////////////////////////////////////////////////
// main forever loop
//////////////////////////////////////////////////////////////////////////////

console.log('Starting url processor daemon');

async.forever(
    function(next) {
		//sleep.sleep(5);
		if (isBusy()) {
			if (gLastPendingReq != gCurrentReq) {
				gLastPendingReq = gCurrentReq;
			}
			else {
				if (gLastPendingReq != null && gCurrentReq == gLastPendingReq) {
					console.log('Forcefully aborting pending request [%s]', gCurrentReq.url);
					// send and error event to the hung request
					gCurrentReq.emit('error');
				}
			}

			console.log('Busy processing...');
			// pause for CHECK_INTERVAL seconds
			setTimeout(next, CHECK_INTERVAL * 1000);
			return;
		}

		var now = new Date();
		console.log('Checking database at ts [%d]', Math.floor(now.getTime() / 1000));

		try {
			// look for everything
			var selector = {
				/*
				active: false,
				checked: false
				*/
			};
			// sort by latest timestamp first
			var opts = {
				sort: [
					[ 'ts', 'desc']
				]
			};
			gMyDatabase.collection(TID_COLLNAME).find(selector, opts).toArray(function(err, result) {
				if (err) {
					throw err;
				}

				//console.log(result);
				if (result.length > 0) {
					var activeIdx = -1;
					// look for inactive batch after an active one
					for (var k = 0; k < result.length; k++) {
						if (result[k].active === true) {
							activeIdx = k;
							break;
						}
					}

					if (activeIdx === 0) {
						// nothing to process, latest batch is already active
						console.log('Latest batch is already active');
					}
					else {
						var idx = (activeIdx == -1) ? (result.length-1) : (activeIdx-1);
						var newBatch = result[idx];
						var activeBatch = (activeIdx == -1) ? null : result[activeIdx];

						// process the new batch
						processBatchUrlColl(newBatch, activeBatch);
					}
				}
				else {
					console.log('No batch to process');
				}

				// pause for CHECK_INTERVAL seconds
				setTimeout(next, CHECK_INTERVAL * 1000);
			});
		}
        catch(exc) {
			next(exc);
		}
    },
    function(err) {
		console.log('Error: ' + err);
    }
);

