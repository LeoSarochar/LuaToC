const {TYPES, FUNCS} = require('./types');
const converter = require('./lua_converter');

class Lua_parser {

    constructor(ast) {
        this.ast = ast;
        this.converter = new converter(this);
    }

    getCallStatement(name) {
        for (let i = 0; this.ast.body[i]; i++) {
            const object = this.ast.body[i];

            if (object.type == "CallStatement" && object.expression.base.name == name) {
                return (object);
            }
        }
    }

    getFunctionReturnType(body) {
        for (let i = 0; body[i]; i++) {
            if (body[i].type == "ReturnStatement")
                return (this.converter.convertType(body[i].arguments[0]));
        }
        return ("void");
    }

    getFunctions() {
        var funcs = [];
        for (let i = 0; this.ast.body[i]; i++) {
            const object = this.ast.body[i];
            if (object.type == "FunctionDeclaration")
                funcs.push(object);
        }
        return (funcs);
    }

    getFunction(name) {
        for (let i = 0; this.ast.body[i]; i++) {
            const object = this.ast.body[i];
            if (object.type == "FunctionDeclaration" && object.identifier.name == name)
                return (object);
        }
    }
}

module.exports = Lua_parser;