import 'reflect-metadata';
import { container } from './inversify.config';
import { Server } from './server/server';
import Types from './types';

const server: Server = container.get<Server>(Types.Server);
server.start();
