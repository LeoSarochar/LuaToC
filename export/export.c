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

static void    affiche(char *str, int nb)
{
    char *test = "Bonjour";
    char *d = "Bonjour";
    char *livio = "Au revoir";

    if (nb < 1) {
        my_printf("%s", "Erreur");
    } else {
        for (int i = 0; i < nb + 5; i += 1) {
            my_printf("%s", "slt");
            my_printf("%s", "\n");
        }
    }
}

int    main(int ac, char **av)
{
    char *var = "Salut";
    int nb = 0;

    nb = 2 + 5 + 6;
    var = my_strconcat(var, " ca va ?");
    if (ac > 1) {
        affiche("huu bonjour\n", my_getnbr(av[1]));
    } else if (ac == 1) {
        my_printf("%s", "Bonjedddour\n");
    }
    return (0);
}
