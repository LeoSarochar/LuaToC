/*
** EPITECH PROJECT, 2019
** my_int_to_str
** File description:
** Convert number to string
*/

static char    *convert_digit(char *dest, int i)
{
    if (i <= -10)
        dest = convert_digit(dest, i / 10);
    *dest++ = '0' - i % 10;
    return (dest);
}

char    *my_int_to_str(char *dest, int i)
{
    char *s = dest;

    if (i < 0)
        *s++ = '-';
    else
        i = -i;
    *convert_digit(s, i) = '\0';
    return (dest);
}