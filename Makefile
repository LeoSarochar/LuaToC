all:
	cd lib/my && gcc -c *.c
	cd ../../
	ar -rsc lib/libmy.a lib/my/*.o
	rm -f lib/my/*.o
	gcc export/*.c -L./lib/ -lmy -o export/a.out