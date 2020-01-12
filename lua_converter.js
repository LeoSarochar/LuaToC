const {TYPES, FUNCS} = require('./types');

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

    convertFunc(name) {
        if (FUNCS[name])
            return (FUNCS[name]);
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
                    break;
                case "Identifier":
                    var declaration = this.Lua.getVariableDeclaration(object.name);
                    if (declaration)
                        ret_type = this.convertType(declaration.init[0]);
                    else {
                        declaration = this.Lua.getVariableDeclaration(object.name, this.Lua.ast.body)
                        const call = this.Lua.getCallStatement(declaration[0].identifier.name);
                        if (call) {
                            for (let i = 0; call.expression.arguments[i]; i++) {
                                const arg = call.expression.arguments[i];
                                if (i == declaration[1])
                                    ret_type = this.convertType(arg);
                            }
                        }
                    }
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
            ret_code += " = " + object.init[i].raw;
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

        for (let i = 0; object.arguments[i]; i++) {
            if (i != 0)
                ret_code += ", ";
            ret_code += this.Lua.getObject(object.arguments[i]);
        }
        ret_code += ")";
        if (!is_in)
            ret_code += ";";
        return (ret_code);
    }

    convertIf(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();

        for (let i = 0; object.clauses[i]; i++) {
            switch (object.clauses[i].type) {
                case "ElseClause":
                    ret_code += " else {";
                    ret_code += "\n" + this.convertCode(object.clauses[i].body);
                    ret_code += "\n" + start_indentation + "}";
                    break;
                case "ElseifClause":
                    ret_code += " else if (";
                    break;
                case "IfClause":
                    ret_code += "if (";
                    break;
            }
            if (object.clauses[i].type != "ElseClause") {
                ret_code += this.Lua.getObject(object.clauses[i].condition.left);
                ret_code += " " + object.clauses[i].condition.operator + " ";
                ret_code += this.Lua.getObject(object.clauses[i].condition.right) + ") {";
                ret_code += "\n" + this.convertCode(object.clauses[i].body);
                ret_code += "\n" + start_indentation + "}";
            }
        }
        return (ret_code);
    }

    convertForNumeric(object) {
        var ret_code = this.getIndentation();
        const start_indentation = this.getIndentation();

        ret_code += "for (int " + object.variable.name + " = " + object.start.raw + "; ";
        ret_code += object.variable.name + " < " + this.Lua.getObject(object.end) + "; ";
        ret_code += object.variable.name + " += 1) {";
        ret_code += "\n" + this.convertCode(object.body);
        ret_code += "\n" + start_indentation + "}";
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
            ret_code += "my_strcat2(" + left + ", " + right + ", -1, 0)";
        } else if (this.convertType(object.left) == "int" || this.convertType(object.right) == "int") {
            ret_code += left + " + " + right;
        }
        return (ret_code);
    }
}

module.exports = Lua_converter;