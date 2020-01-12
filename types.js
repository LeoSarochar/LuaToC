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
    "print":        "my_printf",
    "tonumber":     "my_nbr_to_str",
    "tostring":     "my_getnbr",
    "lowercase":    "my_strlowcase",
    "upcase":       "my_strupcase"
}

module.exports = {TYPES, FUNCS};