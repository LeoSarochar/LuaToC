const fs = require('fs');
const execSync = require("child_process").execSync;
const parser = require('./lua_brain.js');
const Gen_C_code = require('./luatoc.js');

function readLuaFile(path, export_path) {
    const luacode = fs.readFileSync(path).toString() + '\nmain(0, {""})';
    var ast = parser.parse(luacode);
    //console.log(JSON.stringify(ast));
    //console.log("");
    Gen_C_code(ast, export_path);
    execSync("make -C ./lib/my");
    execSync("gcc export/*.c -L./lib/my -lmy -o export/program");
}

function main() {
    const path = process.argv[2];
    const export_path = process.argv[3];

    if (!process.argv[2] || !process.argv[2])
        console.error("Usage : luatoc source.lua export.c")
    else
        readLuaFile(path, export_path);
}

main();