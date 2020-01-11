/*
** EPITECH PROJECT, 2019
** my_charcat
** File description:
** Cat char
*/

#include "my.h"

char *my_int_to_str(char *, int);
int my_strlen(char const *);
char *infin_mult(char *, char *);
char *infin_add(char *, char *);
char *infin_power(char *, char *);

static int    get_pos_base(char c, char const *b)
{
    for (int i = 0; b[i]; i++)
        if (b[i] == c)
            return (i);
}

char    *my_base_to_dec(char *str, char *b)
{
    char *base_len = malloc(sizeof(char) * my_strlen(b) + 1);
    char *result = malloc(sizeof(char) * (my_strlen(str) + 1));
    char *result_str = malloc(sizeof(char) * (my_strlen(str) + 1));
    char *index = malloc(sizeof(char) * (my_strlen(str) + 1));
    char *base_pos = malloc(sizeof(char) * (my_strlen(b) + 1));

    base_len = my_int_to_str(base_len, my_strlen(b));
    my_memset(result_str, 0, my_strlen(str) + 1);
    str = my_revstr(str);
    for (int i = 0; str[i]; i++) {
        index = my_int_to_str(index, i);
        base_pos = my_int_to_str(base_pos, get_pos_base(str[i], b));
        result = infin_mult(infin_power(base_len, index), base_pos);
        result_str = infin_add(result_str, result);
    }
    return (result_str);
}