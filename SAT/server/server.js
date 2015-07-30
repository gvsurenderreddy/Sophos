//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if(!global['App']){
    global.App = {};
}

var express = require('express'),
    nconf = require('nconf'),
    http = require('http'),
    path = require('path'),
    router = require('./app/router.js');

nconf.env().file({ file: 'server-config.json'});

var ServerConfig = nconf.get("ServerConfig");

var app = express();

if(ServerConfig.enableSessions){
    //memory store for sessions - change to different storage here to match your implementation.
    var store  = new express.session.MemoryStore;
}

app.configure(function(){

    app.set('port', process.env.PORT || ServerConfig.port);
    app.use(express.logger(ServerConfig.logger));

    if(ServerConfig.enableUpload){
        app.use(express.bodyParser({uploadDir:ServerConfig.fileUploadFolder})); //take care of body parsing/multipart/files
    }

    app.use(express.methodOverride());

    if(ServerConfig.enableCompression){
        app.use(express.compress()); //Performance - we tell express to use Gzip compression
    }

    if(ServerConfig.enableSessions){
        //Required for session
        app.use(express.cookieParser());
        app.use(express.session({ secret: ServerConfig.sessionSecret, store: store }));
    }

    app.use(ServerConfig.baseURL, express.static(ServerConfig.webRoot));

});

//CORS Supports
if(ServerConfig.enableCORS){
    app.use( function(req, res, next) {
        res.header('Access-Control-Allow-Origin', ServerConfig.AccessControlAllowOrigin); // allowed hosts
        res.header('Access-Control-Allow-Methods', ServerConfig.AccessControlAllowMethods); // what methods should be allowed
        res.header('Access-Control-Allow-Headers', ServerConfig.AccessControlAllowHeaders); //specify headers
        res.header('Access-Control-Allow-Credentials', ServerConfig.AccessControlAllowCredentials); //include cookies as part of the request if set to true
        res.header('Access-Control-Max-Age', ServerConfig.AccessControlMaxAge); //prevents from requesting OPTIONS with every server-side call (value in seconds)

        if (req.method === 'OPTIONS') {
            res.send(204);
        }
        else {
            next();
        }
    });
}

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    global.App.mode = 'development';
});

app.configure('production', function(){
    app.use(express.errorHandler());
    global.App.mode = 'production';
});

router.init(app);

server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});