/*
** EPITECH PROJECT, 2019
** my_strcat
** File description:
** Cat two strings
*/

int my_strlen(char *str);

char    *my_strcat(char *dest, char const *src)
{
    int dest_size = my_strlen(dest);
    int i;

    for (i = 0; src[i] != '\0'; i++)
        dest[dest_size + i] = src[i];
    dest[dest_size + i] = '\0';
    return (dest);
}

char    *my_strcat2(char *str, char *str2, int max, int start)
{
    char *ret = NULL;
    int index = 0;
    int len = 0;
    int len2 = 0;

    while (str[len])
        len += 1;
    while (str2[len2])
        len2 += 1;
    ret = malloc(sizeof(char) * (len + len2 + 1));
    for (; str[index]; index++)
        ret[index] = str[index];
    if (start <= len2) {
        for (int i = start; str2[i] && (i < max || max == -1); i++, index++)
            ret[index] = str2[i];
    }
    ret[index] = '\0';
    return (ret);
}