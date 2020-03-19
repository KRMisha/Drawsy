import { container } from '@app/inversify.config';
import { Server } from '@app/server/server';
import Types from '@app/types';

const server: Server = container.get<Server>(Types.Server);
server.start();
