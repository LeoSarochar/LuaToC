-- local function affiche(str, nb)
--     local test, d = "Bonjour"
--     local livio = "Au revoir"

--     if nb < 1 then
--         print("Erreur")
--     else
--         for i = 0, nb + 5 do
--             print("slt")
--             print("\n")
--         end
--     end
-- end

-- function main(ac, av)
--     local var = "Salut"
--     local nb = 0;
--     nb = 2 + 5 + 6;
--     var = var.." ca va ?"

--     if ac > 1 then
--         affiche("huu bonjour\n", tonumber(av[1]))
--     elseif ac == 1 then
--         print("Bonjedddour\n")
--     end
--     return 0
-- end
function main(ac, av)
    local p = 3
    local u = 0
    for i = 0, 1000 do
        print(av[i]+"\n")
        if (av[i] == nil) then
            break
        end
    end
    while (p) do
        u = u * tonumber(av[0])
        print("break the for!\n")
        p = p - 1
    end
end

-- function main(ac, av)
--     for i = 0, ac do
--         print(i)
--     end
--     return 0
-- end