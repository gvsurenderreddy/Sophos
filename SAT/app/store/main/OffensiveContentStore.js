Ext.define('SAT.store.main.OffensiveContentStore', {
    extend: 'Ext.data.Store',

    storeId: 'OffensiveContentStore',

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