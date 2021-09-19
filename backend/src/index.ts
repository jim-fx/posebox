import express from 'express';
import { createServer } from 'http';
import * as config from './config';
import * as middleware from './middleware';
import * as routes from './routes';
import socket from './socket-server';

const app = express();
const server = createServer(app);

socket.connectTo(server);

if (config.isProduction) {
	app.enable('trust proxy');
	app.use(middleware.https);
}

app.use(express.json());

app.use(express.static('../frontend/public'));

app.use('/poses', routes.poses);

app.use('/brain', routes.brain);

app.use('/admin', middleware.adminAuth, express.static('../admin/public'));
app.use('/admin', middleware.adminAuth, routes.admin);

app.use('/data', routes.data);

server.listen(config.PORT, '0.0.0.0', () => {
	console.log(`server listening on port ${config.PORT}`);
});

process.on('SIGINT', function() {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	// some other closing procedures go here
	process.exit(1);
});
