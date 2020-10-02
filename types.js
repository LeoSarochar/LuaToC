const FUNCS_CONVERTER = require('./funcs_converter');

TYPES = {
    "i":    "int",
    "s":    "char *",
    "c":    "char",
    "l":    "long",
    "f":    "float",
    "NumericLiteral":   "int",
    "StringLiteral":   "char *"
}

EXPRESSIONS = {
    "nil":      "NULL"
}

FUNCS = {
    "print":        {name: "my_printf", ret_type: "NumericLiteral"},
    "tonumber":     {name: "my_getnbr", ret_type: "NumericLiteral"},
    "tostring":     {name: "my_atoi", ret_type: "StringLiteral"},
    "isnumber":     {name: "my_str_isnum", ret_type: "NumericLiteral"},
    "isalpha":      {name: "my_str_isalpha", ret_type: "NumericLiteral"},
    "lowercase":    {name: "my_strlowcase", ret_type: "StringLiteral"},
    "upcase":       {name: "my_strupcase", ret_type: "StringLiteral"},
    "strc":         {name: "strc", ret_type: "StringLiteral"}
}

FUNCS_SPECIAL_FORMAT = {
    "print":    FUNCS_CONVERTER.convertPrint,
}

module.exports = {TYPES, FUNCS};