// After config, comes the application
import Express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import Redis from 'redis';
import ExpressSession from 'express-session';
import SessionFileStore from 'session-file-store';
import SessionMemoryStore from 'memorystore';
import SessionRedisStore from 'connect-redis';
import SessionInitializationException from 'sosise-core/build/Exceptions/Session/SessionInitializationException';
import fs from 'fs';
import Compression from 'compression';
import BodyParser from 'body-parser';
import cors from 'cors';


export default class Server {
    public run(): void {
        // Instantiate app
        const app = Express();

        // Use gzip compression in responses
        app.use(Compression());

        let origin = '*';

        const corsOptions = {
            origin,
            credentials: true,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        app.use(cors(corsOptions));

        // Port
        const port = process.env.LISTEN_PORT || process.env.PORT || 10000;

        // Session support
        // Check if session config exists
        if (fs.existsSync(process.cwd() + '/build/config/session.js')) {
            // Require session config
            const sessionConfig = require(process.cwd() + '/build/config/session').default;

            // Only if sessions are enabled in the config
            if (sessionConfig.enabled) {
                // Trust first proxy
                app.set('trust proxy', 1);

                // Initialize session store
                switch (sessionConfig.driver) {
                    case 'file':
                        const FileStore = SessionFileStore(ExpressSession);
                        sessionConfig.store = new FileStore(sessionConfig.drivers[sessionConfig.driver]);
                        break;

                    case 'memory':
                        const MemoryStore = SessionMemoryStore(ExpressSession);
                        sessionConfig.store = new MemoryStore(sessionConfig.drivers[sessionConfig.driver]);
                        break;

                    case 'redis':
                        const RedisStore = SessionRedisStore(ExpressSession);
                        sessionConfig.store = new RedisStore({ client: Redis.createClient(), ...sessionConfig.drivers[sessionConfig.driver] });
                        break;

                    default:
                        throw new SessionInitializationException('Session driver is not supported, let me know which driver you need, I will add it');
                }
                app.use(ExpressSession(sessionConfig));
            }
        }

        // Initialize sentry
        const sentryConfig = require(process.cwd() + '/build/config/sentry').default;
        Sentry.init({
            environment: process.env.APP_ENV,
            dsn: sentryConfig.dsn,
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Tracing.Integrations.Express({ app }),
            ],
            tracesSampleRate: 1.0,
        });

        // Setting up POST params parser
        app.use(Express.json());
        app.use(Express.urlencoded({
            extended: true
        }));

        // Setting up multipart/form-data

        app.use(BodyParser.raw({
            limit: '150mb',
            // type: '*/*'
        }));

        // app.use(ExpressFormData.parse({
        //     uploadDir: os.tmpdir(),
        //     autoClean: true
        // }));
        // app.use(ExpressFormData.format());
        // app.use(ExpressFormData.stream());
        // app.use(ExpressFormData.union());

        // RequestHandler creates a separate execution context using domains, so that every
        // transaction/span/breadcrumb is attached to its own Hub instance
        app.use(Sentry.Handlers.requestHandler());
        // TracingHandler creates a trace for every incoming request
        app.use(Sentry.Handlers.tracingHandler());

        // Dynamic middlewares registration
        const middlewares = require(process.cwd() + '/build/app/Http/Middlewares/Kernel').middlewares;
        for (const middleware of middlewares) {
            const middlewarePath = process.cwd() + '/build/app/Http/Middlewares/' + middleware + '.js';
            // At this step use require, instead of import, because it's synchronous
            const middlewareClass = require(middlewarePath);
            const middlewareInstance = new middlewareClass.default();
            app.use(middlewareInstance.handle);
        }

        // Setting up routes
        const apiRoutes = require(process.cwd() + '/build/routes/api').default;
        app.use('/', apiRoutes);

        // The error handler must be before any other error middleware and after all controllers
        app.use(Sentry.Handlers.errorHandler());

        // Exception handler
        const Handler = require(process.cwd() + '/build/app/Exceptions/Handler').default;
        app.use((error: any, request: Request, response: Response, next: NextFunction) => {
            new Handler().reportHttpException(request, response, error);
        });

        // Start the server
        app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
    }
}