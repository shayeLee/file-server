import path from 'path';
import Koa from 'koa';
import controller from './controller';
import staticFiles from './middleware/staticFiles';
import templating from './middleware/templating';

/* import mysqlConfig from './mysql.config';
const Sequelize = require('sequelize');

const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
  host: mysqlConfig.host,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  }
}); */

const app = new Koa();

app.use(async (ctx: Koa.Context, next: Function) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  const start = new Date().getTime();
  let execTime: number;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(staticFiles('/static/', path.join(__dirname, '/static/')));

const isProduction = process.env.ENV === 'production';
app.use(templating('views', {
  noCache: !isProduction,
  watch: !isProduction
}));

app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');