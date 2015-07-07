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
                    'AdwareStore', 'PhishingStore', 'FilterAvoidStore', 'SSLStore']
    },

    alias: 'controller.main',

    listen: {
        component: {
            '[itemId=results-grid]': {
                itemclick: 'onResultsItemClick'
            }
        }
    },

    onResultsItemClick: function(view, category, item, index, e) {
        var clickedEl = Ext.get(e.target),
            value = clickedEl.getAttribute("class"),
            storeName = this.getStores()[index], timesRun = 0, me = this;

        if (value === 'rerun') {
            item.querySelector('.rerun').style.setProperty('display', 'none');
            item.querySelector('.result-pass').style.setProperty('display', 'none');

            var store = Ext.StoreManager.lookup(storeName);
            var f = setInterval(function(){
                timesRun += 20;
                if(timesRun === 100){
                    clearInterval(f);
                }
                me.rerunChart(timesRun, 100-timesRun, index , item);
            }, 1000);
        }
    },

    rerunChart: function(t, o, index, item) {
        var chart = Ext.ComponentQuery.query('[itemId=polarChart]')[index];

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
            y: 48
        });

        if(t === 100) {
            item.querySelector('.rerun').style.setProperty('display', 'block');
            item.querySelector('.result-pass').style.setProperty('display', 'block');
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

    handleCheckBoxSelection: function(checkbox, checked) {

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
        var tpl = new Ext.XTemplate("<div class='gridIcons'><img src='resources/images/{value}'></div>");
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
                        "<div class='gridSmallIcon' style='float: left'><img src='resources/images/{smallImage}'></div>" +
                        "<div class='threatTitle' style='float: left; margin-left: 5px; color: #0171B9; font-size: medium; font-weight: 400'>{title}</div>&nbsp;&nbsp;"+

                        "<div class='result-pass' style='float: left; margin-left: 5px; background-color:rgb(22, 192, 81); text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none''>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<table class='stats>" +
                        "<tr class='stats-row'>" +
                            "<td class='ping'>" +
                                "<p style='margin-top: 5px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Ping</p>"+
                                "<div class='ping-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>10ms</div>"+
                            "</td>"+
                            "<td class='download'>" +
                                "<p style='margin-top: 5px; color: #0171B9; font-size: smaller; font-weight: 600;' class='download-text'>Download Speed</p>"+
                                "<div class='download-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>45.2Mbps</div>"+
                            "</td>"+
                            "<td class='upload'>" +
                                "<p style='margin-top: 5px; color: #0171B9; font-size: smaller; font-weight: 600;' class='upload-text'>Upload Speed</p>"+
                                "<div class='upload-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>15.9Mbps</div>"+
                            "</td>"+
                            "<td style='padding-left: 10px' class='content-td'>" +
                                "<div class='gridContent' style='white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left;'>{value}</div>"+
                                "<a href='#details' style='float: right; font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
                                "<input type='button' class='rerun' value='Rerun Test' style='margin-right: 10px; background: #007ac6; float:right; border-radius: 5px; width: 80px; color: #fff; font-size: 10px; display: none'>"+
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
                        "<div class='gridSmallIcon' style='float: left'><img src='resources/images/{smallImage}'></div>" +
                        "<div class='threatTitle' style='float: left; margin-left: 5px; color: #0171B9; font-size: medium; font-weight: 400'>{title}</div>&nbsp;&nbsp;"+

                        "<div class='result-pass' style='float: left; margin-left: 5px; background-color:rgb(22, 192, 81); text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none''>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<div class='mid-div'>"+
                        "<div class='gridContent' style='white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left'>{value}</div>"+
                    "</div>"+

                    "<br><br>"+
                    "<div class='bottom-div' style='margin-top: 25px;'>"+
                        "<a href='#details' style='float: right; font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
                        "<input type='button' class='rerun' value='Rerun Test' style='margin-right: 10px; background: #007ac6; float:right; border-radius: 5px; width: 80px; color: #fff; font-size: 10px; display: none'>"+
                    "</div>"+
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

    renderGridChart: function() {
        var rows = Ext.query('.results-grid .x-grid-row'), counter = 0,
            stores = this.getStores();


        var chart = Ext.ComponentQuery.query('[itemId=polarChart]');

        if(chart && chart.length > 0) {
            Ext.each(chart, function(c){
                c.destroy();
            });
        }
        Ext.each(rows, function(r){
            var column = r.querySelectorAll('.x-grid-td')[1],
                cell = column.querySelector('.x-grid-cell-inner');

            var chart = Ext.create('SAT.view.main.PolarChart', {
                store: 'main.'+stores[counter]
            });
            chart.render(cell);
            counter++;
        });
    },

    onClickStartAudit: function(a, b) {
        var view = this.getView(),
            me = this,
            initGrid = view.down('[itemId=init-grid]'),
            resultsGrid = view.down('[itemId=results-grid]');

        initGrid.hide();
        resultsGrid.show();

        this.renderGridChart();

        var counter = 0;
        var u = setInterval(function(){
            counter += 10;
            if(counter === 50){
                clearInterval(u);
            }
            me.updateStats(Math.round((Math.random()) * 20), 'upload');
        },1000);

        var c = 0;
        var d = setInterval(function(){
            c += 10;
            if(c === 50){
                clearInterval(d);
            }
            me.updateStats(Math.round((Math.random()) * 20), 'download');
        },1000);

        var timesRun = 0;
        var f = setInterval(function(){
            timesRun += 20;
            if(timesRun === 100){
                clearInterval(f);
            }
            me.updateChart(timesRun, 100-timesRun);
        }, 1000);

        var buttons = Ext.ComponentQuery.query('[cls=start-button]');
        Ext.each(buttons, function(b){
            b.setText('View Full Results');
            b.getEl().setStyle('padding', '10px 2px');
        });
    },

    updateChart: function(t, o) {
        var chart = Ext.ComponentQuery.query('[itemId=polarChart]');

        Ext.each(chart, function(c){
            var obj = [
                {cat: 'Total global threats', data1: t},
                {cat: 'Other threats', data1: o}
            ];
            c.store.loadRawData(obj);
            c.redraw();
            var centerTxtVal = c.store.data.items[0].data.data1 + "%",
                sprite = c.getSurface();
            sprite.removeAll(true);
            sprite.add({
                type: 'text',
                text: centerTxtVal,
                fontSize: 12,
                color: '#2ac8ef',
                x: t===100 ? 30 : 35,
                y: 48
            });
        });

        if(t === 100) {
            var results = Ext.select('.result-pass').elements;
            Ext.each(results, function(r){
                r.style.setProperty('display', 'block');
            });

            var reruns = Ext.select('.rerun').elements;
            Ext.each(reruns, function(r){
                r.style.setProperty('display', 'block');
            });
        }
    },

    updateStats: function(val, testMode){
        var sRef = (testMode == "download" ? ".download-box" : ".upload-box");
        var speed = Ext.select(sRef).elements[0];

        if(speed){
            speed.innerHTML = val+'Mbps';
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
    }

});
