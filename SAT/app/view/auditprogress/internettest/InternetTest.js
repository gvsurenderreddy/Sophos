
Ext.define("SAT.view.auditprogress.internettest.InternetTest",{
    extend: "Ext.panel.Panel",
 
    requires: [
        "SAT.view.auditprogress.internettest.InternetTestController",
        "SAT.view.auditprogress.internettest.InternetTestModel",
        "Ext.chart.PolarChart",
        "Ext.chart.axis.Numeric",
        "Ext.chart.series.Gauge",
        "Ext.chart.series.sprite.PieSlice"
    ],
    
    controller: "auditprogress-internettest-internettest",
    viewModel: {
        type: "auditprogress-internettest-internettest"
    },
    xtype: "internettest",
    layout:{
        type: "hbox",
        align: "stretch"
    },
    //style: "border: 1px solid silver;",
    initComponent: function () {
        var me = this;

        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['mbps' ],
            data: [
                { mbps: 45 }
            ]
        });

        me.items = [
            {
                xtype: 'polar',
                flex: 3,
                animate: true,
                padding: 10,
                store: store,
                insetPadding: 30,
                header:{
                    xtype: "container",
                    style: "text-align: center;",
                    html: "<div class='internet-chart-title'>Internet Connection Test</div>"
                },
                axes: {
                    type: 'numeric',
                    position: 'gauge',
                    maximum: 100,
                    majorTickSteps: 5,
                    renderer: function (v) {
                        return (v) + ' Mbps';
                    }
                },
                series: {
                    type: 'gauge',
                    field: 'mbps',
                    donut: 75,
                    needle: true
                }
            },
            {
                xtype: "panel",
                flex: 1,
                padding: 5,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                defaults:{
                    flex: 1,
                    margin: 5
                },
                items: [
                    {
                        xtype: "panel",
                        cls: "internet-stats",
                        title: "Ping",
                        html: "10 <span class='internet-stats-units'>ms</span>"
                    },
                    {
                        xtype: "panel",
                        cls: "internet-stats",
                        title: "Download Speed",
                        html: "45.2 <span class='internet-stats-units'>Mbps</span>"
                    },
                    {
                        xtype: "panel",
                        cls: "internet-stats",
                        title: "Upload Speed",
                        html: "15.9 <span class='internet-stats-units'>Mbps</span>"
                    }
                ]
            }
        ];


        this.callParent();
    }
});
