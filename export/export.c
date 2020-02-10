/*
** EPITECH PROJECT, 2019
** PROJECT
** File description:
** DESCRIPTION
*/

#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "../lib/my/my.h"

void    main(int ac, char **av)
{
    int p = 3;
    int u = 0;

    for (int i = 0; i < 1000; i += 1) {
        my_printf("%s", my_strconcat(av[i], "\n"));
        if (av[i] == NULL)
            break;
    }
    while (p) {
        u = u * my_getnbr(av[0]);
        my_printf("%s", "break the for!\n");
        p = p - 1;
    }
}
