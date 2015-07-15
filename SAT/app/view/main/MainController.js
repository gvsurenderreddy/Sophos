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

                        "<div class='result-pass' style='float: left; margin-left: 5px; margin-top: -3px; background-color:rgb(22, 192, 81); text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none''>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<table class='stats' style='float:left'>" +
                        "<tr class='stats-row'>" +
                            "<td class='ping'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Ping</p>"+
                                "<div class='ping-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>10ms</div>"+
                            "</td>"+
                            "<td class='download'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='download-text'>Download Speed</p>"+
                                "<div class='download-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>0 Mbps</div>"+
                            "</td>"+
                            "<td class='upload'>" +
                                "<p style='margin-top: 2px; color: #0171B9; font-size: smaller; font-weight: 600;' class='upload-text'>Upload Speed</p>"+
                                "<div class='upload-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>0 Mbps</div>"+
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

                        "<div class='result-pass' style='float: left; margin-left: 5px; margin-top: -3px; background-color:rgb(22, 192, 81); text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none''>Passed!</div>"+
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
        var row = Ext.query('.results-grid .x-grid-row')[index],
            store = this.getStores()[index];

        var column = row.querySelectorAll('.x-grid-td')[2],
            cell = column.querySelector('.x-grid-cell-inner');

        var chart = Ext.create('SAT.view.main.PolarChart', {
            store: 'main.'+store
        });
        chart.render(cell);
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

//        var arr = [], counter = 0;
//        var checkbox = Ext.ComponentQuery.query('[xtype=checkbox]');
//        Ext.each(checkbox, function(c){
//            if(!c.checked) {
//                arr.push(counter);
//            }
//            counter++;
//        });

        this.executePromise(0).then(function() {
            me.updateIcon(0);
            me.updateButtons(0);
            return me.executePromise(1);
        }).then(function() {
            me.updateIcon(1);
            me.updateButtons(1);
            return me.executePromise(2);
        }).then(function() {
            me.updateIcon(2);
            me.updateButtons(2);
            return me.executePromise(3);
        }).then(function() {
            me.updateIcon(3);
            me.updateButtons(3);
            return me.executePromise(4);
        }).then(function() {
            me.updateIcon(4);
            me.updateButtons(4);
            return me.executePromise(5);
        }).then(function() {
            me.updateIcon(5);
            me.updateButtons(5);
            return me.executePromise(6);
        }).then(function(){
            me.updateIcon(6);
            me.updateButtons(6);
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

    executePromise: function(index) {
        var me = this;

        // Remove Icon
        var row = Ext.query('.results-grid .x-grid-row')[index],
            column = row.querySelectorAll('.x-grid-td')[2],

        cell = column.querySelector('.x-grid-cell-inner');
        cell.innerHTML = '';

        // Render Chart
        this.renderGridChart(index);

        // Execute Promise
        var promise = new Promise(function(resolve, reject) {
            var timesRun = 0;
            var f = setInterval(function(){
                timesRun += 20;
                if(timesRun === 100){
                    clearInterval(f);
                    resolve("Stuff worked!");
                }
                if(index === 0) {
                    me.updateStats(Math.round((Math.random()) * 20), 'upload');
                    me.updateStats(Math.round((Math.random()) * 20), 'download');
                }
                me.updateChart(timesRun, 100-timesRun, index);
            }, 1000);
        });

        return promise;
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

    updateChart: function(t, o, index) {
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
            y: 43
        });

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
