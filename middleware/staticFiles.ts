import Koa from 'koa';
import path from 'path';

export default function staticFiles(url: string, dir: string) {
  return async (ctx: Koa.Context, next: Function) => {
    let rpath = ctx.request.path;
    // 判断是否以指定的url开头:
    if (rpath.startsWith(url)) {
      // 获取文件完整路径:
      let fp = path.join(dir, rpath.substring(url.length));
      // 判断文件是否存在:
      const fs = require('mz/fs');
      const mime = require('mime');
      if (await fs.exists(fp)) {
        // 查找文件的mime:
        ctx.response.type = mime.getType(rpath);
        // 读取文件内容并赋值给response.body:
        ctx.response.body = await fs.readFile(fp);
      } else {
        // 文件不存在:
        ctx.response.status = 404;
      }
    } else {
      // 不是指定前缀的URL，继续处理下一个middleware:
      await next();
    }
  };
}