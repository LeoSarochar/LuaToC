const {TYPES, FUNCS, EXPRESSIONS} = require('./types');

class Lua_converter {

    constructor() {
        this.Indentation = 0;
    }

    setParser(Lua) {
        this.Lua = Lua;
    }

    setIndentation(nb) {
        this.Indentation += nb;
        if (this.Indentation < 0)
            this.Indentation = 0;
    }

    getIndentation() {
        var ret_indentation = "";

        for (let i = 0; i < this.Indentation; i++)
            ret_indentation += " ";
        return (ret_indentation);
    }

    convertCode(code) {
        this.setIndentation(4);
        var ret_code = "";
        var in_declaration = 0;

        for (let i = 0; code[i]; i++) {
            //check if there is variable declaration for norm
            if (code[i].type == "LocalStatement")
                in_declaration = 1;
        }
        for (let i = 0; code[i]; i++) {
            const object = code[i];

            if (i != 0)
                ret_code += "\n";
            if (object.type != "LocalStatement" && in_declaration == 1) {
                ret_code += "\n";
                in_declaration = 0;
            }
            ret_code += this.Lua.getObject(object);
        }
        this.setIndentation(-4);
        return (ret_code);
    }

    convertExpression(object) {
        let ret_code = "";

        switch (object.raw) {
            case "nil":
                ret_code = "NULL";
                break;
            default:
                ret_code = object.raw;
        }

        return (ret_code);
    }

    convertFunc(name) {
        if (FUNCS[name])
            return (FUNCS[name].name);
        else
            return (name);
    }

    convertType(object) {
        let ret_type = "void";
        let is_array = false;
        let converted_type = TYPES[object.type];
        if (converted_type)
            ret_type = converted_type;
        else {
            switch (object.type) {
                case "TableConstructorExpression":
                    is_array = true;
                    ret_type = TYPES[object.fields[0].value.type];
                    break;
                case "IndexExpression":
                    ret_type = this.convertType(object.base);
                    if (ret_type.includes("**")) //special case for char **
                        ret_type = ret_type.replace('*', "");
                    else
                        ret_type = ret_type.replace(' *', "");
                    break;
                case "Identifier":
                    if (object.raw == "nil")
                        return ("char *");
                    var declaration = this.Lua.getVariableDeclaration(object.name);
                    if (declaration) {
                        if (declaration.init)
                            ret_type = this.convertType(declaration.init[0]);
                        else if (declaration.start)
                            ret_type = this.convertType(declaration.start);
                        else
                            ret_type = "int";
                    } else {
                        declaration = this.Lua.getVariableDeclaration(object.name, this.Lua.ast.body)
                        const call = this.Lua.getCallStatement(declaration[0].identifier.name);
                        if (call) {
                            for (let i = 0; call.arguments[i]; i++) {
                                const arg = call.arguments[i];
                                if (i == declaration[1])
                                    ret_type = this.convertType(arg);
                            }
                        }
                    }
                    break;
                case "CallExpression":
                    if (FUNCS[object.base.name]) {
                        ret_type = this.convertType({type: FUNCS[object.base.name].ret_type});
                    } else {
                        ret_type = this.Lua.getSpecificFunctionReturnType(object.base.name);
                    }
                    break;
                case "BinaryExpression":
                    ret_type = this.convertType(object.left);
                    break;
            }
        }
        if (is_array) {
            if (!ret_type.includes("*"))
                ret_type += " ";
            ret_type += "*";
        }
        return (ret_type);
    }

    convertVariable(object) {
        var ret_code = "";
        for (let i = 0; object.variables[i]; i++) {
            if (i != 0)
                ret_code += "\n";
            if (!object.init[i])
                object.init[i] = object.init[0];
            ret_code += this.getIndentation() + this.convertType(object.init[i]);
            if (!this.convertType(object.init[i]).includes("*"))
                ret_code += " ";
            ret_code += object.variables[i].name;
            ret_code += " = " + this.Lua.getObject(object.init[i]);
            ret_code += ";";
        }
        return (ret_code);
    }

    convertAssignment(object) {
        var ret_code = "";

        for (let i = 0; object.variables[i]; i++) {
            if (i != 0)
                ret_code += "\n";
            if (!object.init[i])
                object.init[i] = object.init[0];
            ret_code += this.getIndentation();
            ret_code += object.variables[i].name;
            ret_code += " = " + this.Lua.getObject(object.init[i]);
            ret_code += ";";
        }
        return (ret_code)
    }

    convertCall(object, is_in) {
        var ret_code = (is_in ? "" : this.getIndentation()) + this.convertFunc(object.base.name);
        ret_code += "(";

        if (!FUNCS_SPECIAL_FORMAT[object.base.name]) {
            for (let i = 0; object.arguments[i]; i++) {
                if (i != 0)
                    ret_code += ", ";
                ret_code += this.Lua.getObject(object.arguments[i]);
            }
        } else {
            ret_code += FUNCS_SPECIAL_FORMAT[object.base.name](this.Lua, object.arguments);
        }
        ret_code += ")";
        if (!is_in)
            ret_code += ";";
        return (ret_code);
    }

    convertCondition(left, operator, right) {
        var ret_code = ""

        if (operator == "and")
            operator = "&&";
        else if (operator == "or")
            operator = "||";
        if (!right) {
            right = {};
            right.type = "NumericLitteral";
            right.raw = "1";
            operator = "==";
        }
        if (left.raw == "nil" || right.raw == "nil") {
            ret_code += this.Lua.getObject(left);
            ret_code += " " + operator + " ";
            ret_code += this.Lua.getObject(right)
            return (ret_code);
        }
        if (operator == "~=")
            operator = "!="
        if (this.Lua.getVariableType(left) == "char *" || this.Lua.getVariableType(right) == "char *") {
            let prefix = "!";
            if (operator == "!=")
                prefix = "";
            ret_code += prefix + "my_strcmp(" + this.Lua.getObject(left)+", " + this.Lua.getObject(right) + ")";
        } else {
            ret_code += this.Lua.getObject(left);
            ret_code += " " + operator + " ";
            ret_code += this.Lua.getObject(right)
        }
        return (ret_code)
    }

    convertIf(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();
        let brackets = [" {", "\n" + start_indentation + "}"];
        for (let i = 0; object.clauses[i]; i++) {
            const in_code = this.convertCode(object.clauses[i].body)
            if (in_code.split("\n").length == 1)
                brackets = ["", ""];
            switch (object.clauses[i].type) {
                case "ElseClause":
                    if (ret_code.split("").splice(-1) != "}")
                        ret_code += "\n" + start_indentation
                    else
                        ret_code += " "
                    ret_code += "else " + brackets[0];
                    ret_code += "\n" + in_code;
                    ret_code += brackets[1];
                    break;
                case "ElseifClause":
                    if (ret_code.split("").splice(-1) != "}")
                        ret_code += "\n"
                    else
                        ret_code += " "
                    ret_code += "else if (";
                    break;
                case "IfClause":
                    ret_code += "if (";
                    break;
            }
            if (object.clauses[i].type != "ElseClause") {
                if (object.clauses[i].condition.left) {
                    ret_code += this.convertCondition(object.clauses[i].condition.left, object.clauses[i].condition.operator, object.clauses[i].condition.right);
                } else {
                    ret_code += this.convertCondition(object.clauses[i].condition);
                }
                ret_code += ")" + brackets[0];
                ret_code += "\n" + in_code;
                ret_code += brackets[1];
            }
        }
        return (ret_code);
    }

    convertForNumeric(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();
        let step = 1;
        if (object.step)
            step = this.Lua.getObject(object.step);
        let brackets = [" {", "\n" + start_indentation + "}"];
        const in_code = this.convertCode(object.body, object)
        if (in_code.split("\n").length == 1)
            brackets = ["", ""];
        ret_code += "for (int " + object.variable.name + " = " + object.start.raw + "; ";
        ret_code += object.variable.name + " < " + this.Lua.getObject(object.end) + "; ";
        ret_code += object.variable.name + " += " + step + ")" + brackets[0];
        ret_code += "\n" + in_code;
        ret_code += brackets[1];
        return (ret_code);
    }

    convertForGeneric(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();
        const pairs_arg = object.iterators[0].arguments[0].name + "[" + object.variables[0].name + "]";
        this.Lua.replaceVarName(object.variables[1].name, pairs_arg, object.variables[0].name, object.body);

        let brackets = [" {", "\n" + start_indentation + "}"];
        const in_code = this.convertCode(object.body)
        if (in_code.split("\n").length == 1)
            brackets = ["", ""];
        ret_code += "for (int " + object.variables[0].name + " = 0; ";
        ret_code += pairs_arg + "; ";
        ret_code += object.variables[0].name + " += 1)" + brackets[0];
        ret_code += "\n" + in_code;
        ret_code += brackets[1]
        return (ret_code);
    }

    convertWhile(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();

        let brackets = [" {", "\n" + start_indentation + "}"];
        const in_code = this.convertCode(object.body)
        if (in_code.split("\n").length == 1)
            brackets = ["", ""];
        ret_code += "while ("
        if (this.Lua.getObject(object.condition)) {
            ret_code += this.Lua.getObject(object.condition);
        } else {
            ret_code += this.convertCondition(object.condition.left, object.condition.operator, object.condition.right);
        }
        ret_code += ")" + brackets[0]
        ret_code += "\n" + in_code;
        ret_code += brackets[1];
        return (ret_code);
    }

    convertReturn(object) {
        var ret_code = this.getIndentation();

        if (!object.arguments[0])
            ret_code += "return;";
        else
            ret_code += "return (" + this.Lua.getObject(object.arguments[0]) + ");";
        return (ret_code);
    }

    convertBinary(object) {
        var ret_code = "";

        const left = this.Lua.getObject(object.left);
        const right = this.Lua.getObject(object.right);
        if (this.convertType(object.left) == "char *" || this.convertType(object.right) == "char *") {
            ret_code += "strc(" + left + ", " + right + ")";
        } else if (this.convertType(object.left) == "int" || this.convertType(object.right) == "int") {
            ret_code += left + ` ${object.operator} ` + right;
        }
        return (ret_code);
    }

    convertTableConstructor(object) {
        var ret_code = "{";

        const fields = object.fields
        for (let i = 0; fields[i]; i++) {
            if (i != 0)
                ret_code += ", ";
            if (fields[i].value.raw)
                ret_code += fields[i].value.raw
            else
                ret_code += fields[i].value.name
        }
        ret_code += "}";
        return (ret_code);
    }
}

module.exports = Lua_converter;