class C_writter {

    static gen_header()
    {
        var header = "/*\n** EPITECH PROJECT, 2019\n** PROJECT\n** File description:\n** DESCRIPTION\n*/\n";

        return (header);
    }

    static gen_includes()
    {
        var includes = "#include <stdlib.h>\n";
        includes += "#include <unistd.h>\n";
        includes += "#include <stdio.h>\n";
        includes += "#include \"../lib/my/my.h\"\n";
        return (includes);
    }

    static create_function(name, args, body, return_type, is_static) {
        var func = "";
        if (is_static)
            func += "static ";
        func += return_type;
        func += "    ";
        func += name + "(";

        let nb_args = 0;
        for (let i = 0; args[i]; i++)
            nb_args++;
        for (let i = 0; args[i]; i++) {
            if (i != 0)
                func += ", ";
            func += args[i].type;
            if (!args[i].type.includes("*"))
                func += " ";
            func += args[i].name;
        }
        if (nb_args == 0)
            func += "void";
        func += ")\n{\n";
        func += body;
        func += "\n}";
        return (func)
    }
}

module.exports = C_writter;