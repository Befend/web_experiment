/*
 * @Author: lzl
 * @Date: 2021-06-28 16:26:16
 * @LastEditTime: 2021-06-28 17:37:13
 * @FilePath: \sps-monitoring-assessment\build\bin\build-router.js
 * @Description:构建页面路由
 * 生成所有模块
 * node build/bin/build-router.js
 * 生成仅包含模块
 * node build/bin/build-router.js MonitorAssessment
 */
const fs = require('fs');
const path = require('path');

const endOfLine = require('os').EOL;
const render = require('json-templater/string');

// 生成Router index.js modules.json
const OUTPUT_PATH = path.join(__dirname, '../../src/router/asyncRoutes.js');
// routers
const IMPORT_TEMPLATE = "{{name}}: () => import('{{package}}')";
const MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-router.js' */
/* 此文件由 './build/bin/build-router.js' 自动生成 */

export const asyncRoutes = {
  {{include}}
}

`;
const includeComponentTemplate = [];
const componentsFile = require('../../src/router/components.json');
let defaultIncludeKeys = process.argv.slice(2);
!defaultIncludeKeys.length && (defaultIncludeKeys = Object.keys(componentsFile));
Object.keys(componentsFile)
  .filter((name) => defaultIncludeKeys.includes(name))
  .forEach((name) => {
    includeComponentTemplate.push(
      render(IMPORT_TEMPLATE, {
        package: componentsFile[name],
        name
      })
    );
  });

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(',' + endOfLine)
});
fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build router] DONE:', OUTPUT_PATH);
