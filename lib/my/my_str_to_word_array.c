/*
** EPITECH PROJECT, 2019
** my_str_to_word_array
** File description:
** String to word array
*/

#include <stdlib.h>
#include "my.h"

int    is_alphabetic(char c)
{
    char *str = malloc(sizeof(char) * 2);

    str[0] = c;
    str[1] = '\0';
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
        return (1);
    else if (c >= '0' && c <= '9')
        return (1);
    else {
        if (my_str_isprintable(str))
            return (1);
    }
    return (0);
}

int    get_nb_words(char const *str)
{
    int nb_words = 0;

    for (int index = 0; str[index] != '\0'; index++) {
        if (!is_alphabetic(str[index]))
            nb_words++;
    }
    return (nb_words + 1);
}

int    get_len_word(char const *str, int i)
{
    int len = 0;

    if (i == 1)
        i--;
    while (is_alphabetic(str[i])) {
        len++;
        i++;
    }
    return (len);
}

char  *get_word(char const *str, int i)
{
    int i_word = 0;
    char *word = malloc(sizeof(char) * (get_len_word(str, i) + 1));

    if (i == 1)
        i--;
    while (is_alphabetic(str[i])) {
        word[i_word] = str[i];
        i++;
        i_word++;
    }
    word[i_word] = '\0';
    return (word);
}

char    **my_str_to_word_array(char const *str)
{
    int nb_words = get_nb_words(str);
    int i = 0;
    int i_a = 0;
    char **tab = malloc(sizeof(char *) * (nb_words + 1));
    for (; str[i] != '\0'; i++) {
        if ((!is_alphabetic(str[i]) || i == 0) && is_alphabetic(str[i+1])) {
            tab[i_a] = malloc(sizeof(char) * (get_len_word(str, i + 1) + 1));
            tab[i_a] = get_word(str, i + 1);
            tab[i_a][0] != '\0' ? i_a++ : 0;
        }
    }
    tab[i_a] = NULL;
    return (tab);
}
