Ext.define('SAT.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
    ],

    alias: 'controller.main',

    launchProgressWindow: function(){
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
    }
});
