Ext.define('SAT.view.auditprogress.internettest.InternetTestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auditprogress-internettest-internettest',
    drawChart: function(cmp, opt, mode){
        var me = this,
            view = this.getView(),
            chartPnl = view.down('panel[id=chartcontainer]'),
            testMode = mode || "download";
        //EXIT, check for tab disabled
        if(view.isDisabled()){
            return false;
        }
                $('#chartcontainer').highcharts({

                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Test',
                        style: {
                            visibility: 'hidden'
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
                            borderWidth: 40,
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
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: 'Mbps'
                        },
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
                        data: [80],
                        tooltip: {
                            valueSuffix: ' Mbps'
                        }
                    }]

                },
                    // Add some life
                    function (chart) {
                        var refreshMillisec = 200,
                            maxRefreshCount = 50,
                            count = 0,
                            testMode = "download",
                            title = "Internet Connection - Download Test";;

                        if (!chart.renderer.forExport) {
                            var setIntervalHandle = setInterval(function () {
                                if(!chartPnl){
                                    return false;
                                }
                                var point = chart.series[0].points[0],
                                    newVal,
                                    inc = Math.round((Math.random() - 0.5) * 20);

                                newVal = point.y + inc;
                                if (newVal < 0 || newVal > 100) {
                                    newVal = point.y - inc;
                                }
                                point.update(newVal);

                                //switch to "Upload" mode
                                if(count == maxRefreshCount/2){
                                    testMode = "upload";
                                    title = "Internet Connection - Upload Test";
                                     point.update(10);
                                }
                                //chart.setTitle({text: title});
                                //debugger;
                                chartPnl.setTitle(title);

                                //update Ext components on Right
                                me.updateStats(newVal, testMode);
                                count++;
                            }, refreshMillisec);

                            //kill set interval and stop refresh
                           setTimeout(function(){
                                clearInterval(setIntervalHandle);
                                setIntervalHandle = 0;
                            }, refreshMillisec * maxRefreshCount);
                        }
                    });
    },
    updateStats: function(val, testMode){
        var pnlRef = (testMode == "download" ? "pnlDownloadStats" : "pnlUploadStats");
            pnl= this.lookupReference(pnlRef);
            if(pnl){
                pnl.update( val + " <span class='internet-stats-units'>Mbps</span>");
            }
    }
    
});
