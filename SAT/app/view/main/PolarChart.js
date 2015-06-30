Ext.define('SAT.view.main.PolarChart', {
    extend: 'Ext.panel.Panel',
    xtype: 'polarchart',

    width: 75,

    margin: '0 0 0 5',
    layout: 'fit',

    items:[
        {
            xtype: 'polar',
            header: false,
            width: 75,
            height: 90,
            colors: ["#2ac8ef", "#ececec"],
            animate: false,
            store: Ext.create('Ext.data.JsonStore', {
                fields: ['os', 'data1'],
                data: [
                    {cat: 'Total global threats', data1: 18},
                    {cat: 'Other threats', data1: 82}
                ]
            }),
            insetPadding: {top: 2, left: 2, right: 2, bottom: 2},
            innerPadding: 2,
            series: [{
                type: 'pie',
                angleField: 'data1',
                donut: 95,
                //highlight: true,
                tooltip: {
                    trackMouse: true,
                    style: 'background: #fff',
                    renderer: function (storeItem, item) {
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
                            color: '#2ac8ef',
                            x: 40,
                            y: 45
                        });
                    sprite.show(true);
                }
            }
        }]
});