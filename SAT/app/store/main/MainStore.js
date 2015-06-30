Ext.define('SAT.store.main.MainStore', {
    extend: 'Ext.data.Store',

    storeId: 'MainStore',

    fields:['active', 'gridIcon', 'threatTitle', 'gridContent'],

    data:{'items':[
        { 'active': true, 'gridIcon': 'graphic-network.png', 'threatTitle': 'Internet Speed Test', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, explicabo."},
        { 'active': true, 'gridIcon': 'graphic-offensive.png', 'threatTitle': 'Offensive Content', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."},
        { 'active': true, 'gridIcon': 'graphic-malware.png', 'threatTitle': 'Malware', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."},
        { 'active': true, 'gridIcon': 'graphic-adware.png', 'threatTitle': 'Adware/Spyware', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."},
        { 'active': true, 'gridIcon': 'graphic-phishing.png', 'threatTitle': 'Phishing', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."},
        { 'active': true, 'gridIcon': 'graphic-filter.png', 'threatTitle': 'Filter Avoidance/Anonymizing Sites', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."},
        { 'active': true, 'gridIcon': 'graphic-filter.png', 'threatTitle': 'SSL Vulnerability', "gridContent":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam remsdfdsfs aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },

    autoLoad: true
});