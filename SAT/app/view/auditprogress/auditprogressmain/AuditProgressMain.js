
Ext.define("SAT.view.auditprogress.auditprogressmain.AuditProgressMain",{
    extend: "Ext.panel.Panel",
 
    requires: [
        "SAT.view.auditprogress.auditprogressmain.AuditProgressMainController",
        "SAT.view.auditprogress.auditprogressmain.AuditProgressMainModel",
        "SAT.view.auditprogress.audittabpanel.AuditTabPanel"
    ],
    
    controller: "auditprogress-auditprogressmain-auditprogressmain",
    viewModel: {
        type: "auditprogress-auditprogressmain-auditprogressmain"
    },
    xtype: "auditprogressmain",
    layout:{
        type: "vbox",
        align: "stretch"
    },
    defaults: {

    },
    cls: "progress-main",
    padding: 10,
    items: [
        {
            xtype: "panel",
            height: 30,
            layout:{
                type: "hbox",
                align: "stretch"
            },
            items:[
                {
                    xtype: "container",
                    flex: 1,
                    html: "<div class='progress-header'>Audit in Progress...</div>"
                },
                {
                    xtype: "container",
                    flex: 1,
                    style: "text-align: right;",
                    html: "<span class='icon-clock'>&nbsp;</span><span class='header-time-msg'>Total estimated time remaining: 1 min 42 seconds</span>"
                }
            ]
        },
        {
            xtype: "audittabpanel",
            flex: 1
        }
    ]
});
