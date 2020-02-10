const Funcs_conerter = {
    convertPrint: (Lua, args)  => {
        let arg1 = "\"";
        let va_args = "";
        for (let i = 0; args[i]; i++) {
            if (i != 0)
                va_args += ", ";
            const obj = Lua.getObject(args[i]);

            if (obj.match(/^\".*\"$/)) {
                arg1 += obj.replace(/\"/g, "");
                continue;
            }
            let type = Lua.getVariableType(args[i]);

            va_args += Lua.getObject(args[i]);
            if (FUNCS[obj.split("(")[0]])
                type = Lua.converter.convertType({type: FUNCS[obj.split("(")[0]].ret_type});
            switch (type) {
                case "int":
                    arg1 += "%d";
                    break;
                case "char":
                    arg1 += "%c";
                    break;
                case "char *":
                    arg1 += "%s";
                    break;
            }
        }
        if (va_args != "")
            return (arg1 + "\", " + va_args);
        else
            return (arg1 + "\"");
    }
}

module.exports = Funcs_conerter;