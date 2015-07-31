Ext.define('SAT.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'SAT.view.main.PolarChart',
        'SAT.store.main.SpeedTestStore',
        'SAT.store.main.OffensiveContentStore',
        'SAT.store.main.MalwareStore',
        'SAT.store.main.AdwareStore',
        'SAT.store.main.PhishingStore',
        'SAT.store.main.FilterAvoidStore',
        'SAT.store.main.SSLStore'
    ],

    config: {
        stores: ['SpeedTestStore', 'OffensiveContentStore', 'MalwareStore',
                    'AdwareStore', 'PhishingStore', 'FilterAvoidStore', 'SSLStore'],
        arr: []
    },

    alias: 'controller.main',

    listen: {
        component: {
            '[itemId=results-grid]': {
                itemclick: 'onResultsItemClick'
            }
        }
    },

    handleCheckBoxSelection: function(cb, checked) {
        var index = cb.$widgetRecord.data.index,
            row = Ext.query('.results-grid .x-grid-row')[index],
            column = row.querySelectorAll('.x-grid-td');

        if(!checked) {
            column[2].style.setProperty('opacity', '0.5');
            column[3].style.setProperty('opacity', '0.5');
        } else {
            column[2].style.setProperty('opacity', '1');
            column[3].style.setProperty('opacity', '1');
        }
    },

    onResultsItemClick: function(view, category, item, index, e) {
        var clickedEl = Ext.get(e.target),
            value = clickedEl.getAttribute("class"), me = this;

        if (value === 'rerun') {
            item.querySelector('.rerun').style.setProperty('display', 'none');
            item.querySelector('.result-pass').style.setProperty('display', 'none');

            me.rerunChart(index);
        }
    },

    launchProgressWindow: function(){
            //check if atleast 1 audit is chosen
            var chkBoxes = Ext.ComponentQuery.query("checkbox[name='chkAudit']"),
                isChecked = false;
               $.each(chkBoxes, function(index, chkBox){
                    isChecked = chkBox.getValue();
                    if(isChecked){
                       return false;
                    }
                });
            //EXIT, if none chosen
            if(!isChecked){
                this.launchWarnMsgBox("Audit Selection", "Please select atleast one audit and try again.");
                return false;
            }

            //generate config for overlay window
            var launchViewRef = this.getView(),
                winConfig = {
                    height: 550,
                    width: 1050,
                    maxHeight: $(window).height() - 10,
                    maxWidth: $(window).width() - 10,
                    layout: 'fit',
                    modal: true,
                    title: "Audit",
                    autoDestroy: true,
                    items: {
                        xtype: "auditprogressmain",
                        displayTitle: "Audit Progress",
                        launchViewRef: launchViewRef
                    }
            };

            this["auditprogressmain"] = Ext.create('Ext.window.Window', winConfig).show();
    },

    launchWarnMsgBox: function(msgTitle, msg) {
        Ext.Msg.show({
            title: msgTitle,
            message: msg,
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OK
        });
    },

    onThreatClick: function(data) {

    },

    onThreatExpandBody: function() {

    },

    onThreatCollapseBody: function() {

    },

    renderGridIcons: function(value, metaData) {
        var data = {
            value: value
        };
        var tpl = new Ext.XTemplate("<div class='gridIcons' style='margin-top: 6px; margin-left: 7px'><img src='resources/images/{value}'></div>");
        var html = tpl.apply(data);
        return html;
    },

    renderGridResultsContent: function(value, metaData) {
        var title = metaData.record.data.threatTitle,
            data = {
                smallImage: metaData.record.data.gridSmallIcon,
                title: title,
                value: value
            };
        if(title === 'Internet Speed Test') {
            var tpl = new Ext.XTemplate(
                "<div class='gridContent'>" +
                    "<div class='top-div'>"+
//                        "<div class='gridSmallIcon' style='float: left;display: none'><img src='resources/images/{smallImage}'></div>" +
                        "<div class='threatTitle' style='float: left; color: #0171B9; font-size: medium; font-weight: 400'>{title}</div>&nbsp;&nbsp;"+

                        "<div class='result-pass' style='float: left; margin-left: 5px; margin-top: -3px; background-color:lightgreen; text-align: center; color:darkgreen; font-weight: 600; width:80px; height: 18px; display: none''>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<table class='stats' style='float:left'>" +
                        "<tr class='stats-row'>" +
                            "<td class='ping'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Ping</p>"+
                                "<div class='ping-box'>0 ms</div>"+
                            "</td>"+
                            "<td class='download'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='download-text'>Download Speed</p>"+
                                "<div class='download-box'>0 Mbps</div>"+
                            "</td>"+
                            "<td class='upload'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='upload-text'>Upload Speed</p>"+
                                "<div class='upload-box'>0 Mbps</div>"+
                            "</td>"+
                            "<td style='padding-left: 10px' class='content-td'>" +
                                "<div class='gridContent' style='margin-top: -42px; white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left;'>{value}</div>"+
                            "</td>"+
                        "</tr>"+
                    "</table>"+
                    "<table class='buttons-div' style='float:right'>"+
                        "<tr>"+
//                            "<td>"+
//                                "<input type='button' class='rerun' value='Rerun Test' style='display:none;background: #007ac6; border-radius: 5px; width: 80px; color: #fff; font-size: 10px;'>"+
//                            "</td>" +
                            "<td>"+
                                "<a href='#details' class='view-details' style='display:none;font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
                            "</td>"+
                        "</tr>"+
                    "</table>"+
                "</div>");
            var html = tpl.apply(data);

            return html;

        } else {
            var tpl = new Ext.XTemplate(
                "<div class='gridContent'>" +
                    "<div class='top-div'>"+
//                        "<div class='gridSmallIcon' style='float: left;display: none'><img src='resources/images/{smallImage}'></div>" +
                        "<div class='threatTitle' style='float: left; color: #0171B9; font-size: medium; font-weight: 400'>{title}</div>&nbsp;&nbsp;"+

                        "<div class='result-pass' style='float: left; margin-left: 5px; margin-top: -3px; background-color:lightgreen; text-align: center; color:darkgreen; font-weight: 600; width:80px; height: 18px; display: none''>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<div class='content-div'>"+
                        "<div class='gridContent' style='margin-top:10px; white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left'>{value}</div>"+
                    "</div>"+

                    "<table class='buttons-div' style='float:right'>"+
                    "<tr>"+
//                        "<td>"+
//                            "<input type='button' class='rerun' value='Rerun Test' style= 'display:none;background: #007ac6; border-radius: 5px; width: 80px; color: #fff; font-size: 10px;'>"+
//                        "</td>" +
                        "<td>"+
                            "<a href='#details' class='view-details' style='display:none;font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
                        "</td>"+
                    "</tr>"+
                    "</table>"+
                "</div>");
            var html = tpl.apply(data);
            return html;
        }
    },

    renderGridContent: function(value, metaData) {
        var title = metaData.record.data.threatTitle,
            data = {
                image: metaData.record.data.gridIcon,
                title: title,
                value: value
            };

        var tpl = new Ext.XTemplate(
                "<div class='threatTitle' style='float: left; color: #0171B9; font-size: medium; font-weight: 400'>{title}</div>" +
                "<br>"+
                "<div class='gridContent'  style='white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400'>{value}</div>");
        var html = tpl.apply(data);
        return html;
    },

    renderGridChart: function(index) {
        var me = this,
            row = Ext.query('.results-grid .x-grid-row')[index],
            store = this.getStores()[index];

        var column = row.querySelectorAll('.x-grid-td')[2],
            cell = column.querySelector('.x-grid-cell-inner');

        var chart = Ext.create('SAT.view.main.PolarChart', {
            store: 'main.'+store
        });

        //high charts
        if(index == 0 ){
            me.renderSpeedTestChart($(cell));
        }else{
            chart.render(cell);
        }

        return chart;
    },

    onClickStartAudit: function(a, b) {
        var me = this;

        this.greyButtons();

        var pass = Ext.query('.result-pass'),
            details = Ext.query('.view-details');

        Ext.each(details, function(d){
            d.style.setProperty('display', 'none');
        });

        Ext.each(pass, function(p){
            p.style.setProperty('display', 'none');
        });

        var counter = 0;
        this.getArr().length = 0;
        var checkbox = Ext.ComponentQuery.query('[xtype=checkbox]');
        Ext.each(checkbox, function(c){
            if(!c.checked) {
                me.getArr().push(counter);
            }
            counter++;
        });

        this.executePromise(0).then(function() {
            if(me.getArr().indexOf(0) === -1) {
                me.updateIcon(0);
                me.updateButtons(0);
            }
            return me.executePromise(1);
        }).then(function() {
            if(me.getArr().indexOf(1) === -1) {
                me.updateIcon(1);
                me.updateButtons(1);
            }
            return me.executePromise(2);
        }).then(function() {
            if(me.getArr().indexOf(2) === -1) {
                me.updateIcon(2);
                me.updateButtons(2);
            }
            return me.executePromise(3);
        }).then(function() {
            if(me.getArr().indexOf(3) === -1) {
                me.updateIcon(3);
                me.updateButtons(3);
            }
            return me.executePromise(4);
        }).then(function() {
            if(me.getArr().indexOf(4) === -1) {
                me.updateIcon(4);
                me.updateButtons(4);
            }
            return me.executePromise(5);
        }).then(function() {
            if(me.getArr().indexOf(5) === -1) {
                me.updateIcon(5);
                me.updateButtons(5);
            }
            return me.executePromise(6);
        }).then(function(){
            if(me.getArr().indexOf(6) === -1) {
                me.updateIcon(6);
                me.updateButtons(6);
            }
            me.destroyCharts();
            me.revertButtons();
        });

    },

    greyButtons: function() {
        var btn = Ext.query('.start-button'),
            button = Ext.ComponentQuery.query('[itemId=start-button]');

        Ext.each(button, function(b){
            b.disabled = true;
        });

        Ext.each(btn, function(b){
            b.style.setProperty('opacity', '0.5');
            b.style.setProperty('cursor', 'default');
        });
    },

    revertButtons: function() {
        var btn = Ext.query('.start-button'),
            button = Ext.ComponentQuery.query('[itemId=start-button]');

        Ext.each(button, function(b){
            b.disabled = false;
        });

        Ext.each(btn, function(b){
            b.style.setProperty('opacity', '1');
            b.style.setProperty('cursor', 'pointer');
        });
    },

    destroyCharts: function() {
        var chart = Ext.ComponentQuery.query('[itemId=polarChart]');
        Ext.each(chart, function(c){
            c.destroy();
        });
    },

    updateIcon: function(index) {
        var grid = Ext.ComponentQuery.query('[itemId=results-grid]')[0],
            store = grid.getStore(),
            record = store.getAt(index),
            icon = record.getData().gridIcon;

        var html = this.renderGridIcons(icon);

        var row = Ext.query('.results-grid .x-grid-row')[index],
            column = row.querySelectorAll('.x-grid-td')[2],
            cell = column.querySelector('.x-grid-cell-inner');

        //clean-up/destroy highcharts and related container class
        if(index === 0){
            $(cell).removeClass("highChartSize");
            this.highChart.destroy();
        }
        cell.innerHTML = html;
    },

    rerunChart: function(index) {
        var me = this,
            row = Ext.query('.results-grid .x-grid-row')[index];

        var column = row.querySelectorAll('.x-grid-td')[2],
            cell = column.querySelector('.x-grid-cell-inner');
            cell.innerHTML = '';

        this.executePromise(index).then(function() {
            me.updateIcon(index);
            me.updateRerunButtons(index);
        });
    },

    updateRerunButtons: function(index) {
        var results = Ext.select('.result-pass').elements[index];
        results.style.setProperty('display', 'block');

        var reruns = Ext.select('.rerun').elements[index];
        reruns.style.setProperty('display', 'block');
    },

    updateButtons: function(index) {
        var results = Ext.select('.result-pass').elements[index];
        results.style.setProperty('display', 'block');

        var details = Ext.select('.view-details').elements[index];
        details.style.setProperty('display', 'block');


        if (index ===6) {
            var btn = Ext.ComponentQuery.query('[cls=start-button]');
            Ext.each(btn, function(b){
                b.setText('View Full Results');
                b.getEl().setStyle('padding', '10px 2px');
            });

//            var btn = Ext.ComponentQuery.query('[itemId=start-button]');
//            Ext.each(btn, function(b) {
//                b.enable();
//            });
        }
    },

    updateChart: function(t, o, index, chart) {

        var obj = [
            {cat: 'Total global threats', data1: t},
            {cat: 'Other threats', data1: o}
        ];
        chart.store.loadRawData(obj);
        chart.redraw();
        var centerTxtVal = chart.store.data.items[0].data.data1 + "%",
            sprite = chart.getSurface();
        sprite.removeAll(true);
        sprite.add({
            type: 'text',
            text: centerTxtVal,
            fontSize: 12,
            color: '#2ac8ef',
            x: t===100 ? 30 : 35,
            y: 43
        });

    },

    updateStats: function(val, testMode){
        //debugger;
        var sRef = (testMode == "download" ? ".download-box" : ".upload-box");
        var speed = Ext.select(sRef).elements[0];

        if(speed){
            speed.innerHTML = (val || 0)  + ' Mbps';
        }
    },

    updatePingBox: function(val){
        var sRef = ".ping-box";
        var pingBox = Ext.select(sRef).elements[0];

        if(pingBox){
            pingBox.innerHTML = (val || 0) + ' ms';
        }
    },

    onClickStartFullAudit: function(a, b) {
        var me = this,
            arr = ['http://updates.html5rocks.com/', 'http://www.simplyhired.com/'];

        Ext.each(arr, function(url){
            me.handleCorsRequest(url);

            var store = Ext.create('Ext.data.Store', {
                fields: [],
                proxy: {
                    type: 'jsonp',
                    url : url
                }
            });

            store.load({
                callback: function (records, operation, success, response) {
                    if(response) {
                        console.log('JSONP Request====');
                        console.log(response.responseText);
                    } else {
                        console.log('JSONP Request====');
                        console.log('No response obtained');
                    }

                }
            });
        });
    },

    handleCorsRequest: function(url) {
        var me = this;

        var xhr = this.createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        xhr.onload = function() {
            var text = xhr.responseText;
            var title = me.getTitle(text);
            console.log('Cors Request Success====');
            console.log('Response from CORS request to ' + url + 'succeeded with status: ' +xhr.status);
            console.log('Fetched titile from response: '+title);
        };

        xhr.onerror = function() {
            console.log('Cors Request Error====');
            console.log('Woops, there was an error making the request. Failed with status: '+xhr.status);
        };

        xhr.send();
    },

    createCORSRequest: function(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    },

    getTitle: function(text) {
        return text.match('<title>(.*)?</title>')[1];
    },

    executePromise: function(index) {
            var me = this;

            if(me.getArr().indexOf(index) !== -1) {
                var promise = new Promise(function(resolve, reject) {
                    resolve('Checkbox disabled!!. Will not execute promise');
                });
                return promise;
            }

            // Remove Icon
            var row = Ext.query('.results-grid .x-grid-row')[index],
                column = row.querySelectorAll('.x-grid-td')[2],

            cell = column.querySelector('.x-grid-cell-inner');
            cell.innerHTML = '';

            // Render Chart
            var chart = this.renderGridChart(index);

            // Execute Promise
            var promise = new Promise(function(resolve, reject) {
                switch(index) {
                    case 0://speed-test
                        me.startSpeedTest(index, resolve, reject, chart);
                        //resolve("Temp-Done"); //localhost
                        break;
                    case 1://offensive
                    case 3://adware
                    case 4://phishing
                    case 5://filter-avoidance
                         me.initAudit(index, chart, resolve, reject);
                        break;
                    case 2://malware
                        me.initAudit(index, chart, resolve, reject);
                        break;
                    case 6://ssl
                        me.initAudit(index, chart, resolve, reject);
                        break;
                    default://make fake data, for testing
                        var timesRun = 0;
                        var f = setInterval(function(){
                            timesRun += 20;
                            if(timesRun === 100){
                                clearInterval(f);
                                resolve("Stuff worked!");
                            }
                            if(index === 0) {
                                //me.updateStats(Math.round((Math.random()) * 20), 'upload');
                                //me.updateStats(Math.round((Math.random()) * 20), 'download');
                            }
                            me.updateChart(timesRun, 100-timesRun, index, chart);
                        }, 1000);
                        break;
                }
            });

            return promise;
    },

    //-----------------------------------------------------------------------------------------------------------//

    startSpeedTest: function(index, resolve, reject, chart){
        var me = this,
            chart = me.highChart,
            speedTestConfig = me.getSpeedTestConfig();

        //create callbacks - onTestCompleted, onError, onProgress
        function onTestCompleted(testResult) {
            me.updatePingBox(testResult.latency);
            me.updateStats(testResult.download, "download" );
            me.updateStats(testResult.upload, "upload" );

            //update Audit final result
            me.displayAuditStatus(index, "Complete!", true);

            //promise resolved
            resolve("SOM worked!!!");
            console.log("SOM onTestCompleted");
        }

        function onError(error) {
           //reject the promise
            reject("SOM failed");
           console.log("SOM Error " + error.code + ": " + error.message);
        }

        function onProgress(progress) {
            var point = chart.series[0].points[0];
            point.update(progress.currentSpeed);

            me.updateStats(progress.currentSpeed, progress.type );

        }
        //init Set up and callbacks
        SomApi.account = speedTestConfig.account;
        SomApi.domainName = speedTestConfig.domainName;
        SomApi.onTestCompleted = onTestCompleted;
        SomApi.onError = onError;
        SomApi.onProgress = onProgress;

        //set config values
        SomApi.config.sustainTime = 3; //Accurate Test (fast)1-8(slow but accurate)
        SomApi.config.testServerEnabled = true;
        SomApi.config.userInfoEnabled = true;
        SomApi.config.latencyTestEnabled = true;
        SomApi.config.uploadTestEnabled = true;
        SomApi.config.progress.enabled = true;
        SomApi.config.progress.verbose = true;

        //start the SpeedTest
        SomApi.startTest();
    },

    renderSpeedTestChart: function($chartContainer){
            var me = this,
            testMode = "download";
            //$chartContainer.css({"height": "100px", "width": "100px"});
            $chartContainer.addClass("highChartSize");
            $chartContainer.highcharts({
                    credits: { enabled: false },
                    tooltip: { enabled: false },
                    dataLabels: false,
                    plotOptions: {
                        gauge: {
                            dataLabels: false
                        }
                    },
                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        spacingTop: 2,
                        spacingLeft: 0,
                        spacingRight: 0,
                        spacingBottom: 0
                    },
                    title: {
                        text: 'Test',
                        style: {
                            display: 'none'
                        }
                    },
                    mode: testMode,
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 4,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },

                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 100,

                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 5,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                         labels: {
                             enabled: false
                         },
                        /*title: {
                         text: 'Mbps'
                         },*/
                        plotBands: [{
                            from: 30,
                            to: 100,
                            color: '#55BF3B' // green
                        }, {
                            from: 10,
                            to: 30,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 0,
                            to: 10,
                            color: '#DF5353' // red
                        }]
                    },

                    series: [{
                        name: 'Speed',
                        data: [80]
                    }]

                },
                //chart callbk
                function (chart) {
                    me.highChart = chart; //shortcut - accessed by Speedtest (SOM) progress callbacks to update current Speed Mbps
                });//end-hc
    },

    //apiPostAuditResults : "data/analyzedresults.json", //replace with REST URI

    //apiUriBot : "data/urllist.json", //replace with REST URI

    //apiUriSsl : "data/urllistssl.json", //replace with REST URI

    //apiUriMalware : "data/urlmalware.json", //replace with REST URI

    deferreds : [],

    results : [],

    gTimeout : 5000,

    //step-1: gets the payload of URLS and Test Methods to audit
    initAudit: function (index, chart, resolve, reject){
            var me = this,
                auditInfo = me.getAuditInfo(index);
            //clear previous results...
            me.cleanUpPreviousTest();

            $.ajax({
                url: auditInfo.uriGetList,
                method: "GET",
                dataType: "json"
            })
            .done(function(list) {
                me.auditUrlsAndPostResults(list, index, chart, resolve, reject);
            })
            .fail(function() {
                resolve("cannot get audit payload");
                console.log("cannot get audit payload");
            })
            .always(function() {
                //alert( "complete" );
            });
    },

    //step-2: loops thro the list of payload URLs with its corresponding Methods
    auditUrlsAndPostResults: function (list, index, chart, resolve, reject){
            var me = this;
            //wait spinner .....
            me.logResponse("Audit status", "Loading and testing " + list.length + " URLs...please wait..... <img class='clsRowSpinner' src='../resources/images/loading.gif'>");

            var i;
            for(i = 0; i < list.length; i++) {
                var url = list[i].url,
                        method = list[i].method ;//  + '?' + new Date().getTime();

                var dObject = new $.Deferred();
                me.deferreds.push(dObject);

                switch(method) {
                    case "CORS":
                        me.doCors(url, index, dObject, list, chart);
                        break;
                    case "JSONP":
                        me.doJsonp(url, index, dObject, list, chart);
                        break;
                    case "IMG":
                        me.doImg(url, index, dObject, list, chart);
                        break;
                    default:
                        break;
                }
            }

            // check if all ajax calls have finished
            $.when.apply($, me.deferreds)
                    .done(function() {
                        //POST all the data gathered for server to process
                        me.postAuditResults(index, resolve, reject);
                        me.logResponse("URL Audit Results:" ,  me.results);
                    });//end:done
        },

    //step-3: POST all the data gathered to server for processing
    //gets Returned the final Audit status
    postAuditResults: function (index, resolve, reject){
            var me = this,
                auditInfo = me.getAuditInfo(index),
                auditType = auditInfo.auditType,
                results = me.results,
                postResultsData = [];

            //collect data to POST to server
             $.each(results, function(index, resp){
                    var urlInfo = {};
                    urlInfo.auditUrl = resp.url;
                    urlInfo.auditType = auditType;
                    urlInfo.xhrResponse =  me.parseAjaxResp(resp);
                    urlInfo.xhrHeaders = me.dumpHeaders(resp);
                    postResultsData.push(urlInfo);
             });

             //POST data
             console.log(JSON.stringify(postResultsData));
          //TODO: Re-enable after CSI server POST is enabled
            $.ajax({
                url: auditInfo.uriPostResult,
                method: "POST",
                data: JSON.stringify(postResultsData)
            })
/*            $.ajax({
                url: auditInfo.uriPostResult,
                method: "GET"
            })*/
            .done(function(data) {
                var auditStatus = (data.status || "Unable to Audit!");

                //update Audit final status
                me.displayAuditStatus(index, auditStatus, false);

                //resolve the Audit
                resolve(auditType + ": Audit-Test both phase Success!");
                console.log(auditType + ": Audit-Test both phase Success!");
            })
            .fail(function() {
                //reject the Audit
                reject(auditType + ": Audit-Test Failed!");
                console.log(auditType + ": Audit-Test Failed!");
            })
            .always(function() {
                //clean-up
            });
        },

    doCors: function (url, index, dObject, list, chart) {
            var me = this;
            //var xdata = {json: $.toJSON({name: number}), delay: 1};
            try{
                $.ajax({
                    url:url,
                    timerStart: new Date().getTime(),
                    timeout: me.gTimeout,
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

                        me.results.push(data);
                        dObject.resolve();

                        me.updateProgressPercentage(list,index, chart);
                    }
                });//end ajax
            }
            catch(e){
                logResponse("Exception:doCors", e);
            }

        },

    doJsonp: function (url, index, dObject, list, chart){
            var me = this;
            try{
                // Example URLs with JSONP support
                // https://graph.facebook.com/?ids=http://www.stackoverflow.com
                // https://jsonp.afeld.me/?callback=?&url=http://jsonview.com/example.json

                $.ajax({
                    url: url,
                    timeout: me.gTimeout,
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

                        me.results.push(data);
                        dObject.resolve();

                        me.updateProgressPercentage(list, index, chart);
                    }
                });//end ajax
            }
            catch(e){
                logResponse("Exception", e);
            }
        },

    doImg: function(url, index, dObject, list, chart){
        var me = this;
        try{
            var imgHandler =
            function(event){
                    var imgLoadStatus = "error";//default to error
                    if(event.type == "load"){//img-loaded
                        var imgWidth = img.naturalWidth,
                            imgHeight = img.naturalHeight;
                        //only if the img has either a height OR width, its a success
                        if(imgWidth > 0 || imgHeight > 0){
                            imgLoadStatus = "success";
                        }
                    }
                    event.url = url;
                    event.status = imgLoadStatus;
                    me.results.push(event);
                    dObject.resolve();
            }//end-handler

            var img = new Image();
            img.onload = imgHandler;
            img.onerror = imgHandler;

            //img.src = url + '/onethatdoesnotexist.gif';
            url = url + '/favicon.ico';
            img.src = url;
        }
        catch(e){
            logResponse("Exception", e);
        }
    },

    updateProgressPercentage: function(list, index, chart){
            var me = this,
                totalUrls = list.length,
                    completedUrls =  me.results.length,
                    completedUrlsPercentage = ((completedUrls/totalUrls) * 100) ;
            //round it
            completedUrlsPercentage = Math.round(completedUrlsPercentage);

            me.updateChart(completedUrlsPercentage, 100-completedUrlsPercentage, index, chart);
            console.log("completedUrlsPercentage= " + completedUrlsPercentage);
        },

    logResponse: function (hdr, msg, isObject){
            var msgTxt = msg;
            if(isObject){
                msgTxt = "";
                $.each(msg, function(key, val){
                    msgTxt += key + "=" + val + "|";
                });
            }
            console.log("Header:" + hdr + "=" + msgTxt );
        },

    parseAjaxResp: function (resp){
            var msg = "", maxResponseTextLength = 100;
            //msg += "|URL:" + resp.url || "";
            msg += "|readyState:" + resp.readyState;
            //msg += "|responseText:" + (resp.responseText ? (resp.responseText.substring(0, maxResponseTextLength)) : "none");
            msg += "|status:" + resp.status;
            msg += "|statusText:" + resp.statusText;
            //msg += "|responseText:" + (resp.responseText || "none");
            //msg += "|timeout:" + resp.timeout;
            return msg;
        },

    dumpHeaders: function(xhr){
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
            else {
                if(_.isObject(xhr)){
                    for (var p in xhr) {
                        if (xhr.hasOwnProperty(p)) {
                            msg += p + '=' + xhr[p] + '|';
                        }
                    }
                }
             }
            return msg;
    },

    displayAuditStatus: function(auditIndex, displayString, blnPass){
         var row = Ext.query('.results-grid .x-grid-row')[auditIndex];
             $(row).find(".result-pass").text(displayString);
    },

    cleanUpPreviousTest: function (){
            var me = this;
            me.deferreds = [];
            me.results = [];
    },

    //TODO: //replace "auditInfo.uriGetList" and "auditInfo.uriPostResult" with REST URI";
    // TODO: move to config
    getAuditInfo: function(auditIndex){
        var auditInfo = {};
            switch(auditIndex) {
                case 0:
                    auditInfo.auditType = "speedtest";
                    auditInfo.uriGetList = ""; //NA
                    auditInfo.uriPostResult = ""; //NA
                    break;
                case 1:
                    auditInfo.auditType = "offensive";
                    auditInfo.uriGetList = "urlList";
                    auditInfo.uriPostResult = "results";
                    break;
                case 2:
                    auditInfo.auditType = "malware";
                    auditInfo.uriGetList = "urlMalwareList";
                    auditInfo.uriPostResult = "results";
                    break;
                case 3:
                    auditInfo.auditType = "adware";
                    auditInfo.uriGetList = "urlList";
                    auditInfo.uriPostResult = "results";
                    break;
                case 4:
                    auditInfo.auditType = "phishing";
                    auditInfo.uriGetList = "urlList";
                    auditInfo.uriPostResult = "results";
                    break;
                case 5:
                    auditInfo.auditType = "filteravoidance";
                    auditInfo.uriGetList = "urlList";
                    auditInfo.uriPostResult = "results";
                    break;
                case 6:
                    auditInfo.auditType = "sslvulnerability";
                    auditInfo.uriGetList = "urlSSLList";
                    auditInfo.uriPostResult = "results";
                    break;
                default:
                    break;
            }
        return auditInfo;
    },

    // TODO: move to config
    getSpeedTestConfig: function(){
            var config = {};

            config.account = "SOM55a3d468ce033"; //your API Key here
            config.domainName = "crowbarsecurityinc.com"; //"labs.example.com" your domain or sub-domain here

            return config;
    }

});
