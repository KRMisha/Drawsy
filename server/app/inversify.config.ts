import 'reflect-metadata';

import { DatabaseController } from '@app/controllers/database.controller';
import { EmailController } from '@app/controllers/email.controller';
import { Application } from '@app/server/app';
import { Server } from '@app/server/server';
import { DatabaseService, databaseUri } from '@app/services/database.service';
import { EmailService } from '@app/services/email.service';
import Types from '@app/types';
import { Container } from 'inversify';

export const container = new Container();

container.bind<Server>(Types.Server).to(Server);
container.bind<Application>(Types.Application).to(Application);

container.bind<DatabaseController>(Types.DatabaseController).to(DatabaseController);
container.bind<string>(Types.DatabaseUri).toConstantValue(databaseUri);
container.bind<DatabaseService>(Types.DatabaseService).to(DatabaseService);

container.bind<EmailController>(Types.EmailController).to(EmailController);
container.bind<EmailService>(Types.EmailService).to(EmailService);
