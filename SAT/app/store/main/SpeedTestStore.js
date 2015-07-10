Ext.define('SAT.store.main.SpeedTestStore', {
    extend: 'Ext.data.Store',

    storeId: 'SpeedTestStore',

    fields: ['os', 'data1'],

    data: [
        {cat: 'Total global threats', data1: 1},
        {cat: 'Other threats', data1: 99}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },

    autoLoad: true
});