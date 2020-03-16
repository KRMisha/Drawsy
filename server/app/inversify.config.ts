import 'reflect-metadata';
import { Container } from 'inversify';
import { DatabaseController } from './controllers/database.controller';
import { Application } from './server/app';
import { Server } from './server/server';
import { DatabaseService } from './services/database.service';
import Types from './types';

export const container: Container = new Container();

container.bind<Server>(Types.Server).to(Server);
container.bind<Application>(Types.Application).to(Application);

container.bind<DatabaseController>(Types.DatabaseController).to(DatabaseController);
container.bind<DatabaseService>(Types.DatabaseService).to(DatabaseService);
