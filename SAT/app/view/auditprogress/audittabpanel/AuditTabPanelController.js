Ext.define('SAT.view.auditprogress.audittabpanel.AuditTabPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auditprogress-audittabpanel-audittabpanel',
    init: function() {
        //enable/disable Tabs on overlay
        var chkBoxes = Ext.ComponentQuery.query("checkbox[name='chkAudit']"),
            tabPnl  = this.getView(),
            tab, action, isChecked, isActiveTabSet = false;
        $.each(chkBoxes, function(index, chkBox){
            action = chkBox.action;
            isChecked = chkBox.getValue();
            tab = tabPnl.child('container[action=' + action + ']');
            //selected audit
            if(isChecked){
                   //first active tab to be pre-selected
                   if(!isActiveTabSet){
                        tabPnl.setActiveTab(tab);
                        isActiveTabSet = true;
                   }
            }else{//unchecked, so disable tab
                tab.setDisabled(true);
            }
        });
    }
});
