const fs = require('fs');
const parser = require('luaparse');
const Gen_C_code = require('./luatoc.js');

function readLuaFile(path, export_path) {
    const luacode = fs.readFileSync(path).toString();
    var ast = parser.parse(luacode);
    console.log(JSON.stringify(ast));
    console.log("")
    Gen_C_code(ast, export_path);  
}

function main() {
    const path = process.argv[2];
    const export_path = process.argv[3];

    if (!process.argv[2] || !process.argv[2]) {
        console.error("Usage : luatoc source.lua export.c")
    } else
        readLuaFile(path, export_path);
}

main();