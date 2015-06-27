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
