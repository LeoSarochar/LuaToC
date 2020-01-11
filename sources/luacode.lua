function affiche(str, nb)
    local test, d = "Bonjour"
    local test = 0
    if nb < 1 then
        print("Erreur")
    else
        for i = 0, nb do
            print(str)
        end
    end
end

affiche("Bonjour", 3)