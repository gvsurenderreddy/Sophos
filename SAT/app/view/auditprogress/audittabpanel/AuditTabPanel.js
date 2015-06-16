
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
            action: 'audit-internet',
            //html : "....Internet Content"
            xtype : "internettest"
        },
        {
            title: "Offensive Content",
            action: 'audit-offensive',
            html : "....Offensive Content...under construction"
        },
        {
            title: "Malware",
            action: 'audit-malware',
            html : "....Malware Content...under construction"
        },
        {
            title: "Adware/Spyware",
            action: 'audit-adware',
            html : "....Adware/Spyware...under construction"
        },
        {
            title: "Phishing",
            action: 'audit-phishing',
            html : "....Phishing Content...under construction"
        },
        {
            title: "Filtering Avoidance",
            action: 'audit-filter',
            html : "....Filtering Avoidance Content...under construction"
        }
    ]
});
