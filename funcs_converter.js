const Funcs_conerter = {
    convertPrint: (Lua, args)  => {
        let arg1 = "\"";
        let va_args = "";
        for (let i = 0; args[i]; i++) {
            if (i != 0)
                va_args += ", ";
            va_args += Lua.getObject(args[i]);
            switch (Lua.getVariableType(args[i])) {
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
        return (arg1 + "\", " + va_args);
    }
}

module.exports = Funcs_conerter;