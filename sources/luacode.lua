
function main(ac, av)
    local test1, test2 = "salut".."sss"
    local test3 = tostring(2)
    for k, v in pairs(av) do
        print(v.." : "..tostring(k))
    end
    if ac == 1 then
        print("dd")
    else
        print("Super")
    end
end