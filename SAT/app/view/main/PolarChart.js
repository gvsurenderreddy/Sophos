Ext.define('SAT.view.main.PolarChart', {
    extend: 'Ext.chart.PolarChart',

//    xtype: 'polar',

    cls: 'sat-polar',

    width: 80,

    margin: '0 0 0 2',
    layout: 'fit',

    itemId: 'polarChart',
    header: false,
    height: 80,
    colors: ["#2ac8ef", "#ececec"],
    animation: {
        easing: 'ease',
        duration: 200
    },
    insetPadding: {top: 0, left: 0, right: 0, bottom: 0},
    innerPadding: 4,
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