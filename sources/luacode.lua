local function affiche(str, nb)
    local test, d = "Bonjour"
    local livio = "Au revoir"

    if nb < 1 then
        print("Erreur")
    else
        for i = 0, nb + 5 do
            print("slt")
            print("\n")
        end
    end
end

function main(ac, av)
    local var = "Salut"
    local nb = 0;
    nb = 2 + 5 + 6;
    var = var.." ca va ?"

    if ac > 1 then
        affiche("huu bonjour\n", tonumber(av[1]))
    elseif ac == 1 then
        print("Bonjedddour\n")
    end
    return 0
end

-- function test(nb)
--     print(nb);
-- end

-- function versnb()
--     return (0)
-- end

-- function main(ac, av)
--     test(versnb());
--     return 0
-- end