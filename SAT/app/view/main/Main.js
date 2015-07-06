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
        'SAT.view.auditprogress.auditprogressmain.AuditProgressMain',
        'Ext.grid.plugin.RowExpander',
        'SAT.view.main.PolarChart'
    ],
    xtype: 'app-main',
    scrollable: true,

    cls: 'sat-main-view',
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'vbox',
        align: 'center'
    },

    items: [{
        xtype: 'panel',
        cls: 'top-panel',
        header: false,
        margin: '0 0 20 0',
        x: 20,
        y: 12,
        width: 800,
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
                }, {
                    xtype: 'label',
                    margin: '0 0 0 8',
                    style: {
                        'font-family': 'Flama-Basic',
                        'font-weight': '400px'
                    },
                    width: 780,
                    height: 80,
                    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                    style: {
                        'white-space': 'pre-wrap'
                    }
                }]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                width: 800,
                margin: '0 0 0 5',
                items: [{
                    xtype: 'component',
                    width: '80%',
                    cls: 'threat-level',
                    autoEl: {
                        html: 'Your Threat Level'
                    }
                }, {
                    xtype: 'button',
                    text: 'Start Audit',
                    cls: 'start-button',
                    handler: "onClickStartAudit",
                    style: {
                        background: '#007ac6',
                        'border-radius': '5px',
                        width: '150px',
                        color: '#fff',
                        'font-size': '28px',
                        float: 'right',
                        padding: '10px 20px',
                        'text-decoration': 'none'
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
                xtype: 'grid',
                itemId: 'init-grid',
                store: 'main.MainStore',
                cls: 'init-grid',
                style: {
                  'border-width':'12px'
                },
                border: true,
                margin: '10 0 0 0',
                width: 800,
                viewConfig: {
                    listeners: {
                        itemclick: 'onThreatClick',
                        expandbody: 'onThreatExpandBody',
                        collapsebody: 'onThreatCollapseBody'
                    }
                },
                hideHeaders: true,
                columns: [
                    {
                        dataIndex: 'active',
                        xtype: 'widgetcolumn',
                        widget: {
                            xtype: 'checkbox',
                            handler: 'handleCheckBoxSelection',
                            name: 'chkAudit'
                        },
                        width: 30
                    },
                    {
                        dataIndex: 'gridIcon',
                        renderer: 'renderGridIcons',
                        itemId: 'gridIcons',
                        width: 100
                    },
                    {
                        dataIndex: 'gridContent',
                        renderer: 'renderGridContent',
                        itemId: 'gridContent',
                        width: 620
                }]
            },
            {
                xtype: 'grid',
                itemId: 'results-grid',
                cls: 'results-grid',
                store: 'main.MainStore',
                border: true,
                hidden: true,
                margin: '10 0 0 0',
                width: 800,
                viewConfig: {
                    listeners: {
                        itemclick: 'onThreatClick',
                        expandbody: 'onThreatExpandBody',
                        collapsebody: 'onThreatCollapseBody'
                    }
                },
                hideHeaders: true,
                plugins: [{
                    ptype: 'rowexpander',
                    pluginId: 'rowexpander',
                    //headerWidth: 1,
                    rowBodyTpl : "<div id='rowexpander-row-{id}' class='clsRowExpander' rowid='{id}'></div>"
                }],
                columns: [
                    {
                        dataIndex: 'polarData',
                        xtype: 'widgetcolumn',
                        widget: {
                            xtype: 'polarchart'
                        },
                        width: 120
                    },
                    {
                        dataIndex: 'gridContent',
                        renderer: 'renderGridResultsContent',
                        itemId: 'gridContent',
                        width: 640
                    }]
            },
            {
                xtype: 'button',
                text: 'Start Audit',
                margin: '20 0 0 0',
                cls: 'start-button',
                handler: "onClickStartAudit",
                style: {
                    background: '#007ac6',
                    'border-radius': '5px',
                    width: '150px',
                    color: '#fff',
                    float: 'right',
                    padding: '10px 20px',
                    'text-decoration': 'none'
                }
        }]
    }]
});
