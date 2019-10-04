import KoaContext from '../types/koaContext';

function createEnv(path: string, opts: Options) {
  const nunjucks = require('nunjucks');
  const
    autoescape = opts.autoescape === undefined ? true : opts.autoescape,
    noCache = opts.noCache || false,
    watch = opts.watch || false,
    throwOnUndefined = opts.throwOnUndefined || false,
    env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(path || 'views', {
        noCache: noCache,
        watch: watch,
      }), {
      autoescape: autoescape,
      throwOnUndefined: throwOnUndefined
    });
  if (opts.filters) {
    for (var f in opts.filters) {
      env.addFilter(f, opts.filters[f]);
    }
  }
  return env;
}

function templating(path: string, opts: Options) {
    // 创建Nunjucks的env对象:
    var env = createEnv(path, opts);
    return async (ctx: KoaContext, next: Function) => {
        // 给ctx绑定render函数:
        ctx.render = function (view: string, model: object) {
            // 把render后的内容赋值给response.body:
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            // 设置Content-Type:
            ctx.response.type = 'text/html';
        };
        // 继续处理请求:
        await next();
    };
}

interface Options {
  autoescape?: boolean | undefined,
  noCache?: boolean | undefined,
  watch?: boolean | undefined,
  throwOnUndefined?: boolean | undefined,
  filters?: Array<string> | undefined,
}

export default templating;