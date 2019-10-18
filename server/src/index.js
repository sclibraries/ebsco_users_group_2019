import { GraphQLServer } from "graphql-yoga"
import session from 'express-session'
import { default as typeDefs } from './typeDefs'
import { default as resolvers } from './resolvers'
import fs from 'fs'
import { authorizedSites } from './config/endpoints'
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var publicCert = fs.readFileSync('/etc/ssl/certs/localhost.crt')
var privateKey = fs.readFileSync('/var/www/key/localhost.key')

const https_cert = fs.readFileSync('/var/www/key/sp-cert.pem', 'utf-8');
const https_pvk = fs.readFileSync('/var/www/key/sp-key.pem', 'utf-8');


const opts = {
    port: 4000,
    playground:'/playground',
    // playground: null,
    cors: {
      credentials: true,
      origin: authorizedSites
    },
    https: {
    	key:  privateKey, //Need these to turn off httpOnly in express session setting
		cert: publicCert 
  	}
  };

const context = (req) => ({
	req: req.request,
});



const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context,
 })
 
server.express.use(bodyParser.urlencoded({extended: true}));
server.express.use(bodyParser.json({type: 'application/json'}));
server.express.use(cookieParser());
server.express.use(session({
	name: 'eds',
	secret: "SECRET_EDS_CODE",
    resave: true,
    saveUninitialized: true,
	  cookie: {
// 		httpOnly: true,
		secret: true,
    	secure: process.env.NODE_ENV === 'production',
		maxAge: 840000 // EDS auth session lasts for 15 minutes.  Set at 14 to recycle sooner.
  	},
}))

//general error handler
//if any route throws, this will be called
server.express.use(function(err, req, res, next){
    res.status(500).send('Server Error! ' + err.message);
});


server.start(opts, () => console.log(`GraphQL server is running on http://localhost:${opts.port}`))