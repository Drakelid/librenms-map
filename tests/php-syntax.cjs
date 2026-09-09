const fs = require('node:fs');
const path = require('node:path');
const Engine = require('php-parser');
const parser = new Engine({ parser:{version:'8.2',suppressErrors:false} });
let count=0;
function scan(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())scan(file);else if(file.endsWith('.php')&&!file.endsWith('.blade.php')){parser.parseCode(fs.readFileSync(file,'utf8'),file);count++;}}}
for(const dir of ['src','routes','config','database','tests/Host'])scan(dir);
console.log(`Parsed ${count} PHP files successfully (syntax only; not host runtime verification).`);
