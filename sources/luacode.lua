local function affiche(str, nb)
    local test, d = "Bonjour"

    if nb < 1 then
        print("Erreur")
    else
        for i = 0, nb do
            print("Salut")
            print("\n")
        end
    end
end

function main(ac, av)
    local var = "Salut"
    local nb = 0;
    nb = 2 + 5 + 6;
    var = var + " ca va ?"
    if (ac > 1) then
        affiche("Bonjour", ac)
    end
    return (0)
end