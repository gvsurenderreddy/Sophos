Ext.define('SAT.view.main.PolarChart', {
    extend: 'Ext.chart.PolarChart',

//    xtype: 'polar',

    width: 80,
//    height:90,

    margin: '0 0 0 5',
    layout: 'fit',

    itemId: 'polarChart',
    header: false,
//    width: 80,
    height: 90,
    colors: ["#2ac8ef", "#ececec"],
    animate: false,
//    store: [],
    insetPadding: {top: 0, left: 0, right: 0, bottom: 0},
    innerPadding: 0.2,
    series: [{
        type: 'pie',
        angleField: 'data1',
        donut: 95,
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

        }
    }

});