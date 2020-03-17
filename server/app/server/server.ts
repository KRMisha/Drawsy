import * as http from 'http';
import { inject, injectable } from 'inversify';
import Types from '../types';
import { Application } from './app';

@injectable()
export class Server {
    private readonly port: string | number | boolean = this.normalizePort(process.env.PORT || '3000');
    private server: http.Server;

    constructor(@inject(Types.Application) private application: Application) {
        this.application.app.set('port', this.port);
        this.server = http.createServer(this.application.app);
    }

    start(): void {
        this.server.listen(this.port);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port = +val;
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind: string = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(): void {
        const address = this.server.address();
        // tslint:disable-next-line: no-non-null-assertion
        const bind: string = typeof address === 'string' ? `pipe ${address}` : `port ${address!.port}`;
        console.log(`Listening on ${bind}`);
    }
}
