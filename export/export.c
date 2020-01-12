/*
** EPITECH PROJECT, 2019
** PROJECT
** File description:
** DESCRIPTION
*/

#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>

static void    affiche(char *str, int nb)
{
    char *test = "Bonjour";
    char *d = "Bonjour";

    if (nb < 1) {
        my_printf("Erreur");
    } else {
        for (int i = 0; i < nb; i += 1) {
            my_printf("Salut");
            my_printf("\n");
        }
    }
}

int    main(int ac, char **av)
{
    char *var = "Salut";
    int nb = 0;

    nb = 2 + 5 + 6;
    var = my_strcat2(var, " ca va ?", -1, 0);
    if (ac > 1) {
        affiche("Bonjour", ac);
    }
    return (0);
}
