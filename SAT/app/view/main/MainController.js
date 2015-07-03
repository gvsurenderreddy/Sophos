Ext.define('SAT.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
    ],

    alias: 'controller.main',

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
                    "</div>"+

                    "<table class='stats>" +
                        "<tr class='stats-row'>" +
                            "<td class='ping'>" +
                                "<p style='margin-top: 10px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Ping</p>"+
                                "<div class='ping-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>10ms</div>"+
                            "</td>"+
                            "<td class='download'>" +
                                "<p style='margin-top: 10px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Download Speed</p>"+
                                "<div class='ping-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>45.2Mbps</div>"+
                            "</td>"+
                            "<td class='upload'>" +
                                "<p style='margin-top: 10px; color: #0171B9; font-size: smaller; font-weight: 600;' class='ping-text'>Upload Speed</p>"+
                                "<div class='ping-box' style='margin-top:-10px; background-color:#C3E2E6; text-align: center; color:black; width:90px; height: 34px; font-size: 18px; font-weight: 300; padding-top: 10px'>15.9Mbps</div>"+
                            "</td>"+
                            "<td style='padding-left: 10px' class='upload'>" +
                                "<div class='gridContent' style='white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left'>{value}</div>"+
                                "<a href='#details' style='float: right; font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
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

                        "<div class='result-pass' style='float: left; margin-left: 5px; background-color:rgb(22, 192, 81); text-align: center; color:#f5f5f5; width:80px; height: 18px;'>Passed!</div>"+
                        "<div class='result-fail' style='float: left; margin-left: 5px; background-color:#cc0000; text-align: center; color:#f5f5f5; width:80px; height: 18px; display: none'>Failed!</div>"+
                    "</div>"+

                    "<div class='mid-div'>"+
                        "<div class='gridContent' style='white-space: pre-wrap;font-family: Flama-Basic;font-weight: 400; float: left'>{value}</div>"+
                    "</div>"+

                    "<br><br>"+
                    "<div class='bottom-div' style='margin-top: 25px;'>"+
                        "<a href='#details' style='float: right; font-family: Flama-Basic; font-weight: 300; text-decoration: none; color:#0171B9;'>View Details</a>"+
                        //"<input type='button' value='Rerun Test' style='margin-right: 10px; background: #007ac6; float:right; border-radius: 5px; width: 80px; color: #fff; font-size: 10px;'>"+
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

    onClickStartAudit: function(a, b) {
        var view = this.getView(),
            initGrid = view.down('[itemId=init-grid]'),
            resultsGrid = view.down('[itemId=results-grid]');

        initGrid.hide();
        resultsGrid.show();
        var buttons = Ext.ComponentQuery.query('[cls=start-button]');
        Ext.each(buttons, function(b){
            b.setText('View Full Results');
            b.getEl().setStyle('padding', '10px 2px');
        });
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
