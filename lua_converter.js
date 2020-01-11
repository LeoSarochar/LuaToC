const {TYPES, FUNCS} = require('./types');

class Lua_converter {

    constructor(Lua) {
        this.Lua = Lua;
        this.Identation = 0;
    }

    getIndentation() {
        var ret_identation = "";

        for (let i = 0; i < this.Identation; i++)
            ret_identation += " ";
        return (ret_identation);
    }

    convertCode(code) {
        this.Identation = 4;
        var ret_code = "";
        var in_declaration = 1;

        for (let i = 0; code[i]; i++) {
            const object = code[i];

            if (i != 0)
                ret_code += "\n";
            if (object.type != "LocalStatement" && in_declaration == 1) {
                ret_code += "\n";
                in_declaration = 0;
            }
            switch (object.type) {
                case "LocalStatement":
                    ret_code += this.convertVariable(object);
                    break;
            }
        }
        this.Identation = 0;
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
        else if (object.type == "TableConstructorExpression") {
            is_array = true;
            ret_type = TYPES[object.fields[0].value.type];
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
}

module.exports = Lua_converter;