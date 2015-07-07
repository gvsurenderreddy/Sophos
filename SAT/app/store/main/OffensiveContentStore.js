Ext.define('SAT.store.main.OffensiveContentStore', {
    extend: 'Ext.data.Store',

    storeId: 'OffensiveContentStore',

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