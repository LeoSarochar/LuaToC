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
            case "ForGenericStatement":
                ret_code += this.converter.convertForGeneric(object);
                break;
            case "ForNumericStatement":
                ret_code += this.converter.convertForNumeric(object);
                break;
            case "WhileStatement":
                ret_code += this.converter.convertWhile(object);
                break;
            case "ReturnStatement":
                ret_code += this.converter.convertReturn(object);
                break;
            case "IndexExpression":
                if (object.index.raw )
                    ret_code += object.base.name + "[" + object.index.raw + "]";
                else
                    ret_code += object.base.name + "[" + object.index.name + "]";
                break;
            case "BinaryExpression":
                ret_code += this.converter.convertBinary(object);
                break;
            case "TableConstructorExpression":
                ret_code += this.converter.convertTableConstructor(object);
                break;
            case "BreakStatement":
                ret_code += this.converter.getIndentation() + "break;";
                break;
            default:
                ret_code += this.converter.convertExpression(object);
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

    replaceVarName(name, new_name, arr_index, obj = this.getCurrentScope().body) {
        for (const i in obj) {
            if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
                if (obj[i].type == "Identifier" && obj[i].name == name) {
                    if (new_name.includes("[")) {
                        obj[i].type = "IndexExpression"
                        obj[i].base = {}
                        obj[i].base.name = new_name.split("[")[0];
                        obj[i].base.type = "Identifier"
                        obj[i].index = {}
                        obj[i].index.type = "NumericLiteral"
                        obj[i].index.value = arr_index
                        obj[i].index.raw = arr_index.toString()
                    }
                    obj[i].name = new_name
                }
                this.replaceVarName(name, new_name, arr_index, obj[i]);
            }
        }
    }

    getVariableDeclaration(name, body = this.getCurrentScope().body) {
        const tbl_body = this.parseBody(body);

        for (let i = 0; tbl_body[i]; i++) {
            const object = tbl_body[i];

            switch (object.type) {
                case "LocalStatement":
                    for (let j = 0; object.variables[j]; j++) {
                        if (object.variables[j].name == name)
                            return (object);
                    }
                    break;
                case "FunctionDeclaration":
                    for (let j = 0; object.parameters[j]; j++) {
                        if (object.parameters[j].name == name)
                            return [object, j];
                    }
                    break;
                case "ForNumericStatement":
                    if (object.variable.name == name)
                        return (object);
                    break;
                case "ForGenericStatement":
                    if (object.variables[0].name == name)
                        return (object);
                    break;
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

    getVariableType(object) {
        return (this.converter.convertType(object));
    }

    getFunctionReturnType(body) {
        for (let i = 0; body[i]; i++) {
            if (body[i].type == "ReturnStatement") {
                if (body[i].arguments[0])
                    return (this.converter.convertType(body[i].arguments[0]));
                else
                    return ("void");
            }
        }
        return ("void");
    }

    getSpecificFunctionReturnType(name) {
        for (let i = 0; this.ast.body[i]; i++) {
            if (this.ast.body[i].type == "FunctionDeclaration" && this.ast.body[i].identifier.name == name) {
                const type = this.getFunctionReturnType(this.ast.body[i].body);
                return (type);
            }
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