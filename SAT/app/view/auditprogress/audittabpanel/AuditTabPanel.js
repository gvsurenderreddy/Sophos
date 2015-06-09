
Ext.define("SAT.view.auditprogress.audittabpanel.AuditTabPanel",{
    extend: "Ext.tab.Panel",
 
    requires: [
        "SAT.view.auditprogress.audittabpanel.AuditTabPanelController",
        "SAT.view.auditprogress.audittabpanel.AuditTabPanelModel",
        "SAT.view.auditprogress.internettest.InternetTest"
    ],
    
    controller: "auditprogress-audittabpanel-audittabpanel",
    viewModel: {
        type: "auditprogress-audittabpanel-audittabpanel"
    },
    xtype: "audittabpanel",
    padding: 0,
    flex: 1,
    tabPosition: "left",
    tabRotation: 0,
    tabBar: {
        border: false
    },
    activeTab: 0,
    defaults:{
        textAlign: 'left',
        padding: 25,
        autoScroll: true
    },
    items: [
        {
            title: "Internet Connection Test",
            //html : "....Internet Content"
            xtype : "internettest"
        },
        {
            title: "Offensive Content",
            html : "....Offensive Content"
        },
        {
            title: "Malware",
            html : "....Malware Content"
        },
        {
            title: "Adware/Spyware",
            html : "....Adware/Spyware"
        },
        {
            title: "Phishing",
            html : "....Phishing Content"
        },
        {
            title: "Filtering Avoidance",
            html : "....Filtering Avoidance Content"
        }
    ]
});
