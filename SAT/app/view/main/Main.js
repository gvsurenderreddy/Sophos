/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('SAT.view.main.Main', {
    extend: 'Ext.panel.Panel',
    requires: [
        'SAT.view.main.MainController',
        'SAT.view.main.MainModel',
        'SAT.store.main.MainStore',
        'Ext.chart.series.Pie',
        'Ext.chart.PolarChart',
        'Ext.chart.interactions.Rotate'
    ],

    xtype: 'app-main',
    scrollable: true,
    cls: 'sat-main-view',
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    width: 800,
    height: 275,

    layout: {
        type: 'absolute'
    },

    items: [{
        xtype: 'panel',
        cls: 'top-panel',
        header: false,
        x: 10,
        y: 25,
        width: 780,
        title: '&nbsp;',
        items: [{
            xtype: 'image',
            src: '../../SAT/resources/images/logo2.png',
            autoEl: 'div'
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            margin: '25 0 0 0',
            cls: 'question-mark',
            items: [{
                xtype: 'component',
                width: 80,
                autoEl: {
                    html: '?'
                },
                style: {
                    width: '70px',
                    height: '80px',
                    'text-align': 'center',
                    padding: '20px 0',
                    color: '#38a8ff',
                    'font-size': '48px',
                    'background-color': 'lightGrey',
                    'margin-bottom': '8px'
                }
            },{
                xtype: 'label',
                margin: '0 0 0 8',
                width: 680,
                height: 80,
                text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
            }]
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            width: 780,
            margin: '0 0 0 5',
            items: [{
                xtype: 'component',
                width: '75%',
                cls: 'threat-level',
                autoEl: {
                    html: 'Your Threat Level'
                }
            },{
                xtype: 'button',
                text: 'Start Full Audit',
                cls: 'start-button',
                handler: function() {
                    alert('You clicked the button!');
                },
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
            }
        },
        {
            xtype: 'panel',
            width: 780,
            height: 750,
            margin: '20 0 0 0',
            layout: 'anchor',
            border: true,
            cls: 'main-panel',
            items: [
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-network.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'label',
                            width: 600,
                            scrollable: true,
                            html:'<b>Internet Connection Test</b> <br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-offensive.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'container',
                            layout: 'anchor',
                            items: [{
                                xtype: 'label',
                                html:'<b>Adware/Spyware</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                            },{
                                xtype: 'component',
                                margin: '8 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '550px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-malware.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'container',
                            layout: 'anchor',
                            items: [{
                                xtype: 'label',
                                html:'<b>Malware</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                            },{
                                xtype: 'component',
                                margin: '8 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '550px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-adware.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'container',
                            layout: 'anchor',
                            items: [{
                                xtype: 'label',
                                html:'<b>Adware/Spyware</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                            },{
                                xtype: 'component',
                                margin: '8 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '550px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-phishing.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'container',
                            layout: 'anchor',
                            items: [{
                                xtype: 'label',
                                html:'<b>Phishing</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                            },{
                                xtype: 'component',
                                margin: '8 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '550px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        }]
                    }]
                },
                {
                    xtype: 'panel',
                    anchor: '100% 16%',
                    border: true,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: 780,
                        margin: '20 0 0 0',
                        items: [{
                            xtype: 'checkbox',
                            width: '5%',
                            margin: '25 0 0 20'
                        },{
                            xtype: 'image',
                            src: '../../SAT/resources/images/graphic-filter.png',
                            autoEl: 'div',
                            width: '15%'
                        },{
                            xtype: 'container',
                            layout: 'anchor',
                            items: [{
                                xtype: 'label',
                                html:'<b>Filter Avoidance/Anonymizing Sites</b><br/> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
                            },{
                                xtype: 'component',
                                margin: '8 0 0 0',
                                autoEl: {
                                    tag: 'div',
                                    html: 'Current Examples: porn.com, iliketurtles.com, stinkyfeet.com, westboro baptist church'
                                },
                                style: {
                                    border: 3,
                                    width: '550px',
                                    color: '#b01900',
                                    'background-color': '#f7eded'
                                }
                            }]

                        }]
                    }]
                }
            ],
            store: 'main.MainStore'

        }]

    }]
});
