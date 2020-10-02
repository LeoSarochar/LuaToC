/*
** EPITECH PROJECT, 2019
** LIB
** File description:
** Nbr to str
*/

#include "my.h"

void reverse(char *str, int length)
{
    int start = 0;
    int end = length - 1;
    char tmp;

    for (;start < end; start++, end--) {
        tmp = *(str+start);
        *(str+start) = *(str+end);
        *(str+end) = tmp;
    }
}

char    *my_atoi(int num)
{
    int i = 0;
    char *str = malloc(sizeof(char) * 12);

    if (num == 0) {
        str[i++] = '0';
        str[i] = '\0';
        return (str);
    }
    while (num != 0) {
        int rem = num % 10;
        str[i++] = (rem > 9)? (rem - 10) + 'a' : rem + '0';
        num = num / 10;
    }
    str[i] = '\0';
    reverse(str, i);
    return (str);
}