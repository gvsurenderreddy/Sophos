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
    launchWarnMsgBox: function(msgTitle, msg){
        Ext.Msg.show({
            title: msgTitle,
            message: msg,
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OK
        });
    }
});
