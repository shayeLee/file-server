import Rounter from 'koa-router';
const router = new Rounter();
import fs from 'fs';
import path from 'path';

// add url-route in /controllers:

function addMapping(router: Rounter, mapping: any) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith('POST ')) {
      var path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register URL mapping: POST ${path}`);
    } else if (url.startsWith('PUT ')) {
      var path = url.substring(4);
      router.put(path, mapping[url]);
      console.log(`register URL mapping: PUT ${path}`);
    } else if (url.startsWith('DELETE ')) {
      var path = url.substring(7);
      router.del(path, mapping[url]);
      console.log(`register URL mapping: DELETE ${path}`);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router: Rounter, dir: string) {
  fs.readdirSync(path.join(__dirname, dir)).filter((f) => {
    return f.endsWith('.ts');
  }).forEach((f) => {
    console.log(`process controller: ${f}...`);
    let mapping = require(path.join(__dirname, dir, f)).default;
    addMapping(router, mapping);
  });
}

export default function (dir = 'controllers') {
  addControllers(router, dir);
  return router.routes();
};