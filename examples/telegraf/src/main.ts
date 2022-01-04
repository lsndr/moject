import { App } from 'moject';
import { AppModule } from './app.module';

const app = App.create(AppModule);

app.start().catch(console.error);
