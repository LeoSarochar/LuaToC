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
    char *str = "sal";
    char *leo = "";

    leo = my_strconcat(str, "wesh");
    my_printf("%s", leo);
}
