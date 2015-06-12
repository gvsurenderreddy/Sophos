/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SAT.view.main.Main', {
    extend: 'Ext.container.Viewport',
    requires: [
        'SAT.view.main.MainController',
        'SAT.view.main.MainModel',
        'SAT.store.main.MainStore',
        'Ext.chart.series.Pie',
        'Ext.chart.PolarChart',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemHighlight',
        'SAT.view.auditprogress.auditprogressmain.AuditProgressMain'
    ],
    xtype: 'app-main',
    scrollable: true,

    cls: 'sat-main-view',
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    width: 900,

    layout: {
        type: 'absolute'
    },

    items: [{
        xtype: 'panel',
        cls: 'top-panel',
        header: false,
        margin: '0 0 20 0',
        x: 20,
        y: 12,
        width: 880,
        title: '&nbsp;',
        items: [
        {
            xtype: 'image',
            src: 'resources/images/logo2.png',
            autoEl: 'div',
            height: 60
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            margin: '10 0 0 0',
            cls: 'question-mark',
            items: [{
                xtype: 'component',
                width: 80,
                autoEl: {
                    tag: 'div',
                    html: '?'
                },
                style: {
                    width: '80px',
                    height: '75px',
                    'text-align': 'center',
                    padding: '30px 0',
                    color: '#38a8ff',
                    'font-size': '50px',
                    'font-weight': '400',
                    'background-color': '#f1f1f1',
                    'border-radius': '5px',
                    'margin-bottom': '10px'
                }
            },{
                xtype: 'label',
                margin: '0 0 0 8',
                style: {
                    'font-family': 'Flama-Basic',
                    'font-weight': '400px'
                },
                width: 780,
                height: 80,
                text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
            }]
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            width: 880,
            margin: '0 0 0 5',
            items: [{
                xtype: 'component',
                width: '80%',
                cls: 'threat-level',
                autoEl: {
                    html: 'Your Threat Level'
                }
            },{
                xtype: 'button',
                text: 'Start Full Audit',
                cls: 'start-button',
                handler: "launchProgressWindow",
                style: {
                    background: '#007ac6',
                    'border-radius': '5px',
                    width: '150px',
                    color: '#fff',
                    'font-size': '28px',
                    float: 'right',
                    padding: '10px 20px',
                    'text-decoration': 'none',
                    'box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)',
                    '-webkit-box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)',
                    '-moz-box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)'
}
            }]

        },
        {
            xtype: 'component',
            width: 280,
            autoEl: {
                html: 'Feel free to customize your audit.'
            },
            style: {
                'font-weight': 500
            }
        },
        {
            xtype: 'panel',
            width: 880,
            margin: '20 0 0 0',
            layout: 'vbox',
            style: {
                'border': '1px solid #dddddd',
                'border-radius': '5px'
            },
            cls: 'main-panel',
            items: [
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-network.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'label',
                            width: 600,
                            html:'<b>Internet Connection Test</b> <br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-offensive.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [{
                                xtype: 'component',
                                autoEl: {
                                    tag: 'div',
                                    html:'<b>Offensive Content</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                                },
                                style: {
                                    width: '600px'
                                }
                            },{
                                xtype: 'component',
                                margin: '5 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '590px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        },
                        {
                            xtype: 'panel',
                            width: 85,
                            margin: '0 0 0 5',
                            layout:{
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'polar',
                                    header: false,
                                    width: 85,
                                    height: 70,
                                    colors: ["#B40808", "#089734"],
                                    //animate: true,
                                    store: Ext.create('Ext.data.JsonStore', {
                                        fields: ['os', 'data1' ],
                                        data: [
                                            { cat: 'Total global threats', data1: 18 },
                                            { cat: 'Other threats', data1: 82 }
                                        ]
                                    }),
                                    insetPadding:  {top: 2, left: 2, right: 2, bottom: 2},
                                    innerPadding: 2,
                                    series: [{
                                        type: 'pie',
                                        angleField: 'data1',
                                        donut: 65,
                                        //highlight: true,
                                        tooltip: {
                                            trackMouse: true,
                                            style: 'background: #fff',
                                            renderer: function(storeItem, item) {
                                                this.setHtml(storeItem.get('cat') + ': ' + storeItem.get('data1') + '%');
                                            }
                                        }
                                    }],
                                    listeners: {
                                        afterrender: function (cmp) {
                                            var surface = cmp.getSurface(),
                                                store = cmp.getStore(),
                                                centerTxtVal = store.data.items[0].data.data1 + "%",
                                                sprite = surface.add({
                                                    type: 'text',
                                                    text: centerTxtVal,
                                                    fontSize: 12,
                                                    color: '#B40808',
                                                    x: 30,
                                                    y: 35
                                                });
                                            sprite.show(true);
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    width: '100%',
                                    html: '<div style="font-size: 11px;color:#004169;font-weight:bold;text-align: center;">% of total <br>global threats</div>'
                                }
                            ]
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-malware.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [{
                                xtype: 'component',
                                autoEl: {
                                    tag: 'div',
                                    html:'<b>Malware</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                                },
                                style: {
                                    width: '600px'
                                }
                            },{
                                xtype: 'component',
                                margin: '5 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '590px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        },
                        {
                            xtype: 'panel',
                            width: 85,
                            margin: '0 0 0 5',
                            layout:{
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'polar',
                                    header: false,
                                    width: 85,
                                    height: 70,
                                    colors: ["#B40808", "#089734"],
                                    //animate: true,
                                    store: Ext.create('Ext.data.JsonStore', {
                                        fields: ['os', 'data1' ],
                                        data: [
                                            { cat: 'Total global threats', data1: 18 },
                                            { cat: 'Other threats', data1: 82 }
                                        ]
                                    }),
                                    insetPadding:  {top: 2, left: 2, right: 2, bottom: 2},
                                    innerPadding: 2,
                                    series: [{
                                        type: 'pie',
                                        angleField: 'data1',
                                        donut: 65,
                                        //highlight: true,
                                        tooltip: {
                                            trackMouse: true,
                                            style: 'background: #fff',
                                            renderer: function(storeItem, item) {
                                                this.setHtml(storeItem.get('cat') + ': ' + storeItem.get('data1') + '%');
                                            }
                                        }
                                    }],
                                    listeners: {
                                        afterrender: function (cmp) {
                                            var surface = cmp.getSurface(),
                                                store = cmp.getStore(),
                                                centerTxtVal = store.data.items[0].data.data1 + "%",
                                                sprite = surface.add({
                                                    type: 'text',
                                                    text: centerTxtVal,
                                                    fontSize: 12,
                                                    color: '#B40808',
                                                    x: 30,
                                                    y: 35
                                                });
                                            sprite.show(true);
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    width: '100%',
                                    html: '<div style="font-size: 11px;color:#004169;font-weight:bold;text-align: center;">% of total <br>global threats</div>'
                                }
                            ]
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-adware.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [{
                                xtype: 'component',
                                autoEl: {
                                    tag: 'div',
                                    html:'<b>Adware/Spyware</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                                },
                                style: {
                                    width: '600px'
                                }
                            },{
                                xtype: 'component',
                                margin: '5 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '590px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        },
                        {
                            xtype: 'panel',
                            width: 85,
                            margin: '0 0 0 5',
                            layout:{
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'polar',
                                    header: false,
                                    width: 85,
                                    height: 70,
                                    colors: ["#B40808", "#089734"],
                                    //animate: true,
                                    store: Ext.create('Ext.data.JsonStore', {
                                        fields: ['os', 'data1' ],
                                        data: [
                                            { cat: 'Total global threats', data1: 18 },
                                            { cat: 'Other threats', data1: 82 }
                                        ]
                                    }),
                                    insetPadding:  {top: 2, left: 2, right: 2, bottom: 2},
                                    innerPadding: 2,
                                    series: [{
                                        type: 'pie',
                                        angleField: 'data1',
                                        donut: 65,
                                        //highlight: true,
                                        tooltip: {
                                            trackMouse: true,
                                            style: 'background: #fff',
                                            renderer: function(storeItem, item) {
                                                this.setHtml(storeItem.get('cat') + ': ' + storeItem.get('data1') + '%');
                                            }
                                        }
                                    }],
                                    listeners: {
                                        afterrender: function (cmp) {
                                            var surface = cmp.getSurface(),
                                                store = cmp.getStore(),
                                                centerTxtVal = store.data.items[0].data.data1 + "%",
                                                sprite = surface.add({
                                                    type: 'text',
                                                    text: centerTxtVal,
                                                    fontSize: 12,
                                                    color: '#B40808',
                                                    x: 30,
                                                    y: 35
                                                });
                                            sprite.show(true);
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    width: '100%',
                                    html: '<div style="font-size: 11px;color:#004169;font-weight:bold;text-align: center;">% of total <br>global threats</div>'
                                }
                            ]
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-phishing.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [{
                                xtype: 'component',
                                autoEl: {
                                    tag: 'div',
                                    html:'<b>Phishing</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                                },
                                style: {
                                    width: '600px'
                                }
                            },{
                                xtype: 'component',
                                margin: '5 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '590px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        },
                        {
                            xtype: 'panel',
                            width: 85,
                            margin: '0 0 0 5',
                            layout:{
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'polar',
                                    header: false,
                                    width: 85,
                                    height: 70,
                                    colors: ["#B40808", "#089734"],
                                    //animate: true,
                                    store: Ext.create('Ext.data.JsonStore', {
                                        fields: ['os', 'data1' ],
                                        data: [
                                            { cat: 'Total global threats', data1: 18 },
                                            { cat: 'Other threats', data1: 82 }
                                        ]
                                    }),
                                    insetPadding:  {top: 2, left: 2, right: 2, bottom: 2},
                                    innerPadding: 2,
                                    series: [{
                                        type: 'pie',
                                        angleField: 'data1',
                                        donut: 65,
                                        //highlight: true,
                                        tooltip: {
                                            trackMouse: true,
                                            style: 'background: #fff',
                                            renderer: function(storeItem, item) {
                                                this.setHtml(storeItem.get('cat') + ': ' + storeItem.get('data1') + '%');
                                            }
                                        }
                                    }],
                                    listeners: {
                                        afterrender: function (cmp) {
                                            var surface = cmp.getSurface(),
                                                store = cmp.getStore(),
                                                centerTxtVal = store.data.items[0].data.data1 + "%",
                                                sprite = surface.add({
                                                    type: 'text',
                                                    text: centerTxtVal,
                                                    fontSize: 12,
                                                    color: '#B40808',
                                                    x: 30,
                                                    y: 35
                                                });
                                            sprite.show(true);
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    width: '100%',
                                    html: '<div style="font-size: 11px;color:#004169;font-weight:bold;text-align: center;">% of total <br>global threats</div>'
                                }
                            ]
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    style: {
                        'border-bottom': '1px solid #dddddd',
                        'padding-bottom': '10px'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 880,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '3%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: 'resources/images/graphic-filter.png',
                            autoEl: 'div',
                            width: '12%'
                        },{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [{
                                xtype: 'component',
                                autoEl: {
                                    tag: 'div',
                                    html:'<b>Filter Avoidance/Anonymizing Sites</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                                },
                                style: {
                                    width: '600px'
                                }
                            },{
                                xtype: 'component',
                                margin: '5 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketasdadaadjalskdalkdalsdhaldurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '590px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        },
                        {
                            xtype: 'panel',
                            width: 85,
                            margin: '0 0 0 5',
                            layout:{
                                type: 'vbox'
                            },
                            items:[
                                {
                                    xtype: 'polar',
                                    header: false,
                                    width: 85,
                                    height: 70,
                                    colors: ["#B40808", "#089734"],
                                    //animate: true,
                                    store: Ext.create('Ext.data.JsonStore', {
                                        fields: ['os', 'data1' ],
                                        data: [
                                            { cat: 'Total global threats', data1: 18 },
                                            { cat: 'Other threats', data1: 82 }
                                        ]
                                    }),
                                    insetPadding:  {top: 2, left: 2, right: 2, bottom: 2},
                                    innerPadding: 2,
                                    series: [{
                                        type: 'pie',
                                        angleField: 'data1',
                                        donut: 65,
                                        //highlight: true,
                                        tooltip: {
                                            trackMouse: true,
                                            style: 'background: #fff',
                                            renderer: function(storeItem, item) {
                                                this.setHtml(storeItem.get('cat') + ': ' + storeItem.get('data1') + '%');
                                            }
                                        }
                                    }],
                                    listeners: {
                                        afterrender: function (cmp) {
                                            var surface = cmp.getSurface(),
                                                store = cmp.getStore(),
                                                centerTxtVal = store.data.items[0].data.data1 + "%",
                                                sprite = surface.add({
                                                    type: 'text',
                                                    text: centerTxtVal,
                                                    fontSize: 12,
                                                    color: '#B40808',
                                                    x: 30,
                                                    y: 35
                                                });
                                            sprite.show(true);
                                        }
                                    }
                                },
                                {
                                    xtype: 'label',
                                    width: '100%',
                                    html: '<div style="font-size: 11px;color:#004169;font-weight:bold;text-align: center;">% of total <br>global threats</div>'
                                }
                            ]
                        }]
                    }]
                }
            ],
            store: 'main.MainStore'

        },{
            xtype: 'button',
            text: 'Start Audit',
            margin: '20 0 0 0',
            cls: 'start-button',
            handler: "launchProgressWindow",
            style: {
                background: '#007ac6',
                'border-radius': '5px',
                width: '150px',
                color: '#fff',
                float: 'right',
                padding: '10px 20px',
                'text-decoration': 'none',
                'box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)',
                '-webkit-box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)',
                '-moz-box-shadow': '0px 0px 21px 0px rgba(64,64,64,0.66)'
            }
        }]

    }]
});
