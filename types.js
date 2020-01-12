TYPES = {
    "i":    "int",
    "s":    "char *",
    "c":    "char",
    "l":    "long",
    "f":    "float",
    "NumericLiteral":   "int",
    "StringLiteral":   "char *"
}

FUNCS = {
    "print":        {name: "my_printf", ret_type: "NumericLiteral"},
    "tonumber":     {name: "my_nbr_to_str", ret_type: "StringLiteral"},
    "tostring":     {name: "my_getnbr", ret_type: "NumericLiteral"},
    "lowercase":    {name: "my_strlowcase", ret_type: "StringLiteral"},
    "upcase":       {name: "my_strupcase", ret_type: "StringLiteral"},
}

FUNCS_SPECIAL_FORMAT = {
    "print":    (args) => {
        return (args);
    }
}

module.exports = {TYPES, FUNCS};