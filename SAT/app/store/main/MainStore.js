Ext.define('SAT.store.main.MainStore', {
    extend: 'Ext.data.Store',

    fields: [
        'rowData'
    ],

    storeId: 'MainStore',

    data:{'items':[
        { 'rowData': 'IC'},
        { 'rowData': 'AS'},
        { 'rowData': 'Mal'},
        { 'rowData': 'Phis'},
        { 'rowData': 'Filter'}
    ]},

    proxy:  {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },

    autoLoad: true
});