import Koa from 'koa';

interface KoaContext extends Koa.Context {
  render(view: string, model: object): void
}

export default KoaContext;