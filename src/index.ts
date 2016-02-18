import * as hapi from 'hapi';
import * as path from 'path';
import { routes } from './routes';
import { sequelize } from './database';
import { migrate } from './database/migrate';
import { seed } from './database/seed';

const server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, '..', 'public')
            }
        }
    }
});

const port = process.env.PORT || 3000;

server.connection({ port: port, host: process.env.HOST });

server.register(require('vision'), (err) => {
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        layout: true,
        layoutPath: './views/layouts',
        helpersPath: './views/helpers',
        partialsPath: './views/partials'
    });
});

server.register(require('inert'), (err) => {});

// Handle errors
server.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom) {
        let response: hapi.IBoom = <any>request.response;
        let code = response.output.statusCode;
        if (code === 404 || code === 500) {
            let template: any = code;
            let title = response.output.payload.error;
            let message = response.stack;
            return reply.view(template, { title: title, message: message, statusCode: code }).code(code);
        }
    }

    return reply.continue();
});

server.route(routes);

server.register({
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, (err) => {
    if (err) {
        throw (err);
    }
    migrate().then(() => {
        server.log('info', 'Migrations complete.');
    }).then (() => {
        sequelize
            .sync()
            .then(() => {
                // Run seeders
                return seed().then(() => {
                    server.log('info', 'Seed complete.');
                    return;
                });
            })
            .then(() => {
                // Start server
                server.start(function () {
                    server.log('info', 'Server running at: ' + server.info.uri);
                });
            });
    });
});

export = server;