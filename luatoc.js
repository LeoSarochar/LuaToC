const fs = require('fs');

const C_writter = require('./c_writter');
const Lua_parser = require('./lua_parser');
const Lua_converter = require('./lua_converter');

let Lua;
let Converter;
let C_code = "";

function write_c_file(export_path) {
    fs.writeFileSync(export_path, C_code);
}

function AddLine(line)
{
    if (C_code != "")
        C_code += "\n";
    C_code += line;
}

function gen_func(func)
{
    var args = [];
    var nb_args = 0;

    Lua.setCurrentScope(func);
    for (; func.parameters[nb_args]; nb_args++);
    if (nb_args > 0) {
        const call = Lua.getCallStatement(func.identifier.name);
        if (call) {
            for (let i = 0; call.expression.arguments[i]; i++) {
                let arg = {};
                arg.name = func.parameters[i].name;
                arg.type = Converter.convertType(call.expression.arguments[i]);
                args[i] = arg;
            }
        } else { //Main
            args[0] = {};
            args[0].name = func.parameters[0].name;
            args[0].type = "int";
            args[1] = {};
            args[1].name = func.parameters[1].name;
            args[1].type = "char **";
        }
    }
    const body = Converter.convertCode(func.body);
    const return_type = Lua.getFunctionReturnType(func.body);
    return (C_writter.create_function(func.identifier.name, args, body, return_type, func.isLocal));
}

function Gen_C_Code(ast, export_path) {
    console.log("Generating C code...")
    Converter = new Lua_converter();
    Lua = new Lua_parser(ast, Converter);
    Converter.setParser(Lua);

    AddLine(C_writter.gen_header());
    AddLine(C_writter.gen_includes());

    for (let i = 0; ast.body[i]; i++) {
        const object = ast.body[i];

        if (i != 0)
            AddLine("")
        switch (object.type) {
            case "FunctionDeclaration":
                AddLine(gen_func(object));
        }
    }
    write_c_file(export_path);
}

module.exports = Gen_C_Code;