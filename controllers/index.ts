import Koa from 'koa';
import KoaContext from '../types/koaContext';

export default {
  'GET /': async (ctx: KoaContext) => {
    ctx.render('index.html', {
      title: 'Welcome ShayeLee'
    });
  }
}