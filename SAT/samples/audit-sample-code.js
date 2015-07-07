/*
 1. Get Urls - Make ajax call to get the Url list for a given audit type (getUrlsByType)
 2. Start Audit - On Success callback of above call, start the audit (auditUrlsAndPostResults)
 3. Resolve Deferred and collect results - After all urls are audited and all deferred objects are resolved, collect results (auditUrlsAndPostResults)
 4. Send results - to CSI server to analyse results (postAuditResults)
 5. Display Results/status - On Success of above call, display the audit status accordingly (postAuditResults)
*/

var apiGetUrls = "../data/urllist.json"; //replace with REST URI
var apiPostAuditResults = "../data/analyzedresults.json"; //replace with REST URI

//---------------------------------------------------------------//
// 1. Get Urls - Make ajax call to get the Url list for a given audit type
function getUrlsByType(auditType){
    $.ajax({
        url: apiGetUrls,
        method: "GET",
        dataType: "json"
    })
    .done(function(list) {
        auditUrlsAndPostResults(list);
    })
    .fail(function() {
        alert( "error" );
    })
    .always(function() {
        //alert( "complete" );
    });
}

//---------------------------------------------------------------//
// 2. Start Audit - On Success callback of above call, start the audit
// 3. Resolve Deferred and collect results - After all urls are audited and all deferred objects are resolved, collect results
function auditUrlsAndPostResults(list){
    var i;
    var deferreds = [];
    var results = [];
    var gTimeout = 5000;

    // --- CORS audit ----- //
    function doAjax(url,dObject) {
        $.ajax({
            url:url,
            timerStart: new Date().getTime(),
            timeout: gTimeout,
            type: "GET",
            contentType: 'text/plain',
            crossDomain: true,
            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
                withCredentials: false
            },
            headers: {
                // Set any custom headers here.
                // If you set any non-simple headers, your server must include these
                // headers in the 'Access-Control-Allow-Headers' response header.
            },
            complete: function(data) {
                data.url = this.url;
                data.method = 'CORS';
                data.timerStart = this.timerStart;
                data.timerEnd = new Date().getTime();
                data.timerDuration = (data.timerEnd - data.timerStart);

                results.push(data);
                dObject.resolve();

                updateProgressPercentage();
            }
        });
    }//end cors audit

    // --- JSONP audit ----- //
    function doJsonp(url,dObject){
        try{
            $.ajax({
                url: url,
                timeout: gTimeout,
                timerStart: new Date().getTime(),
                jsonp: "callback",
                dataType: "jsonp",
                // Work with the response
                complete: function(data) {
                    data.url = this.url;
                    data.method = 'JSONP';
                    data.timerStart = this.timerStart;
                    data.timerEnd = new Date().getTime();
                    data.timerDuration = (data.timerEnd - data.timerStart);

                    results.push(data);
                    dObject.resolve();

                    updateProgressPercentage();
                }
            });//end ajax
        }
        catch(e){
            logResponse("Exception", e);
        }
    }//end: jsonp audit

    function updateProgressPercentage(){
        var totalUrls = list.length,
            completedUrls =  results.length,
            completedUrlsPercentage = ((completedUrls/totalUrls) * 100) ;
        //this is the current processed percentage
        //completedUrlsPercentage
        console.log("completedUrlsPercentage= " + completedUrlsPercentage);
    }

    //Loop thru and audit all URLs
    for(i = 0; i < list.length; i++) {
        var url = list[i].url,
            method = list[i].method ;

        //generate deferred objects and track in an array
        var dObject = new $.Deferred();
        deferreds.push(dObject);

        //call methods (cors, jsonp etc) accordingly
        switch(method) {
            case "CORS":
                doAjax(url,dObject);
                break;
            case "JSONP":
                doJsonp(url,dObject);
                break;
            default:
                break;
        }
    }

    // check if all ajax calls have finished
    $.when.apply($, deferreds)
            .done(function() {

                //sort by method - CORS, JSONP etc
                results = _.sortBy(results, 'method');

                try{
                    //POST Final results
                    postAuditResults(results);

                    logResponse("URL Audit Results:" ,  htmlResults);

                }catch(e){
                    logResponse("Post Results Error", e);
                }
                logResponse("Results", results);
    });//end:done
}

//---------------------------------------------------------------//
// 4. Send results - to CSI server to analyse results
// 5. Display Results/status - On Success of above call, display the audit status accordingly
function postAuditResults(results){
    $.ajax({
        url: apiPostAuditResults,
        method: "POST",
        data: results
    })
        .done(function(data) {
            //this is where server analysed data/reports are returned
            //update view and display reports
            //displayAnalysedReoprts(data);
        })
        .fail(function() {
            //alert( "error" );
        })
        .always(function() {
            //alert( "complete" );
        });
}

//-------------------- Helper functions -------------------------------------------------//
function parseAjaxResp(resp){
    var msg = "";
    //msg += "|URL:" + resp.url || "";
    msg += "|readyState:" + resp.readyState;
    //msg += "|responseText:" + ($('<div/>').html(resp.responseText).text() || "none");
    msg += "|status:" + resp.status;
    msg += "|statusText:" + resp.statusText;
    //msg += "|responseText:" + (resp.responseText || "none");
    //msg += "|timeout:" + resp.timeout;
    return msg;
}

function dumpHeaders(xhr){
    var msg = "";
    if (xhr.getAllResponseHeaders) {
        var hdrs = xhr.getAllResponseHeaders();
        hdrs = hdrs.split('\r\n');
        var hdrCount = 0;
        for (var k = 0; k < hdrs.length; k++) {
            if (hdrs[k].trim().length == 0) {
                continue;
            }
            hdrCount++;
        }
        if (hdrCount > 0) {
            msg += hdrs.join('|');
        }
        else {
            msg += 'No visible response header found';
        }
    }
    return msg;
}

function logResponse(hdr, msg, isObject){
    var msgTxt = msg;
    if(isObject){
        msgTxt = "";
        $.each(msg, function(key, val){
            msgTxt += key + "=" + val + "|";
        });
    }
    console.log( hdr + " = " + msgTxt );
}