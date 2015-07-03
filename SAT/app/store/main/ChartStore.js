Ext.define('SAT.store.main.ChartStore', {
    extend: 'Ext.data.Store',

    storeId: 'ChartStore',

    fields: ['os', 'data1'],

    data: [
        {cat: 'Total global threats', data1: 18},
        {cat: 'Other threats', data1: 82}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },

    autoLoad: true
});