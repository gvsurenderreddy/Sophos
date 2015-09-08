var audit = require('./controller/Audit'),
	bodyParser = require('body-parser');

var router = {

    init: function(app) {

		// generic table/collection REST handlers
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.param('collName', audit.handleCollName);
		app.get('/rxapi/:collName', audit.tableList);
		app.get('/rxapi/:collName/:id', audit.tableItemById);
		app.post('/rxapi/:collName', audit.tableAddMultiple);
		app.put('/rxapi/:collName/:id', audit.tableEditSingle);
		app.delete('/rxapi/:collName/:id', audit.tableDeleteSingle);
		app.delete('/rxapi/:collName', audit.tableDeleteAll);

        app.get('/urlActive', audit.getActiveURLS);
        app.get('/urlList', audit.getBotURLS);
        app.get('/urlSSLList', audit.getSSLList);
        app.get('/urlMalwareList', audit.getMalwareList);
        app.post('/results', audit.getResult);
    }
};

module.exports = router;
