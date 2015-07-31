var fs = require('fs');

var Audit = {
    getBotURLS: function(req, res) {
        fs.readFile(__dirname+'/../data/urllist.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getSSLList: function(req, res) {
        fs.readFile(__dirname+'/../data/urllistssl.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getMalwareList: function(req, res) {
        fs.readFile(__dirname+'/../data/urlmalware.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    },

    getResult: function(req, res) {
        fs.readFile(__dirname+'/../data/analyzedresults.json', 'utf8', function(err, data){
            if(err) throw err;
            res.send(JSON.parse(data));

        });
    }
};

module.exports = Audit;