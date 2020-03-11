import { Container } from 'inversify';
import { DateController } from './controllers/date.controller';
import { IndexController } from './controllers/index.controller';
import { Application } from './server/app';
import { Server } from './server/server';
import { DateService } from './services/date.service';
import { IndexService } from './services/index.service';
import Types from './types';

const container: Container = new Container();

container.bind<Server>(Types.Server).to(Server);
container.bind<Application>(Types.Application).to(Application);

container.bind<IndexController>(Types.IndexController).to(IndexController);
container.bind<IndexService>(Types.IndexService).to(IndexService);

container.bind<DateController>(Types.DateController).to(DateController);
container.bind<DateService>(Types.DateService).to(DateService);

export { container };
