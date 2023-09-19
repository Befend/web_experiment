/*
 * @Author: lzl
 * @Date: 2021-06-28 15:53:37
 * @LastEditTime: 2021-06-28 16:34:33
 * @FilePath: \sps-monitoring-assessment\build\bin\build-entery.js
 * @Description：构建页面模块 node build/bin/build-entery.js
 */
const fs = require('fs');
const path = require('path');
const fileSave = require('file-save');

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    // eslint-disable-next-line no-return-assign
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
const camelize = cached(function(str) {
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Capitalize a string.
 */
const capitalize = cached(function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

function readFileList(dir, components = {}, deep) {
  const files = fs.readdirSync(dir);
  deep !== undefined && deep--;

  files.forEach((dirent) => {
    const fullPath = path.posix.join(dir, dirent);
    const stat = fs.statSync(fullPath);
    let name = path.basename(dirent, '.vue');

    if (stat.isDirectory() && (deep === undefined || deep > 0)) {
      readFileList(path.posix.join(dir, dirent), components, deep); // 递归读取文件
    } else if (stat.isFile() && path.extname(dirent) === '.vue') {
      const componentPath = fullPath.replace(path.resolve(__dirname, `../../src/views`), '@/views');
      const pathlist = componentPath.split(path.posix.sep);
      const camelizeName = camelize(capitalize(pathlist.slice(-2)[0]));
      if (name === 'index') {
        name = camelizeName;
      }
      components[name] = componentPath;
    }
  });

  return components;
}

const Components = {};
readFileList(path.resolve(__dirname, `../../src/views`), Components, 2);

fileSave(path.join(__dirname, '../../src/router/components.json'))
  .write(JSON.stringify(Components, null, '  '), 'utf8')
  .end('\n');

console.log('[build entry] DONE:', path.join(__dirname, '../../src/router/components.json'));
