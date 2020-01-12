class Lua_parser {

    constructor(ast, converter) {
        this.ast = ast;
        this.converter = converter;
        this.currentScope = ast
    }

    setCurrentScope(object) {
        this.currentScope = object;
    }

    getCurrentScope(object) {
        return (this.currentScope);
    }

    getObject(object) {
        var ret_code = "";

        switch (object.type) {
            case "Identifier":
                ret_code += object.name;
                break;
            case "LocalStatement":
                ret_code += this.converter.convertVariable(object);
                break;
            case "AssignmentStatement":
                ret_code += this.converter.convertAssignment(object);
                break;
            case "CallExpression":
                ret_code += this.converter.convertCall(object, true);
                break;
            case "CallStatement":
                ret_code += this.converter.convertCall(object.expression);
                break;
            case "IfStatement":
                ret_code += this.converter.convertIf(object);
                break;
            case "ForNumericStatement":
                ret_code += this.converter.convertForNumeric(object);
                break;
            case "ReturnStatement":
                ret_code += this.converter.convertReturn(object);
                break;
            case "IndexExpression":
                ret_code += object.base.name + "[" + object.index.raw + "]";
                break;
            case "BinaryExpression":
                ret_code += this.converter.convertBinary(object);
                break;
            default:
                ret_code += object.raw;
                break;
        }
        return (ret_code);
    }

    parseBody(body = this.getCurrentScope().body) {
        var objects = [];

        for (let i = 0; body[i]; i++) {
            const object = body[i];
            if (object.body) {
                objects.push(object);
                const tbl_body = this.parseBody(object.body);
                for (let k = 0; tbl_body[k]; k++)
                    objects.push(tbl_body[k]);
            } else if (object.clauses) {
                for (let j = 0; object.clauses[j]; j++) {
                    const tbl_body = this.parseBody(object.clauses[j].body);
                    for (let k = 0; tbl_body[k]; k++)
                        objects.push(tbl_body[k]);
                }
            } else {
                objects.push(object);
            }
        }
        return (objects);
    }

    getVariableDeclaration(name, body = this.getCurrentScope().body) {
        const tbl_body = this.parseBody(body);

        for (let i = 0; tbl_body[i]; i++) {
            const object = tbl_body[i];

            if (object.type == "LocalStatement") {
                for (let j = 0; object.variables[j]; j++) {
                    if (object.variables[j].name == name)
                        return (object);
                }
            } else if (object.type == "FunctionDeclaration") {
                for (let j = 0; object.parameters[j]; j++) {
                    if (object.parameters[j].name == name)
                        return [object, j];
                }
            }
        }
        return (null);
    }

    getCallStatement(name, body = this.ast.body) {
        const tbl_body = this.parseBody(body);

        for (let i = 0; tbl_body[i]; i++) {
            const object = tbl_body[i];
            if (object.type == "CallStatement" && object.expression.base.name == name) {
                return (object);
            }
        }
        return (null);
    }

    getFunctionReturnType(body) {
        for (let i = 0; body[i]; i++) {
            if (body[i].type == "ReturnStatement")
                if (body[i].arguments[0])
                    return (this.converter.convertType(body[i].arguments[0]));
                else
                    return ("void");
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