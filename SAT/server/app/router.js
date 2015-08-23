var audit = require('./controller/Audit');

var router = {

    init: function(app) {
        app.get('/urlActive', audit.getActiveURLS);
        app.get('/urlList', audit.getBotURLS);
        app.get('/urlSSLList', audit.getSSLList);
        app.get('/urlMalwareList', audit.getMalwareList);
        app.post('/results', audit.getResult);
    }
};

module.exports = router;
