CC = gcc
CFLAGS = -std=c17 -Wall -Wextra -Wpedantic -Werror -O2

marks-demo: main.o marks.o
	$(CC) $(CFLAGS) main.o marks.o -o marks-demo

main.o: main.c marks.h
	$(CC) $(CFLAGS) -c main.c -o main.o

marks.o: marks.c marks.h
	$(CC) $(CFLAGS) -c marks.c -o marks.o

.PHONY: clean
clean:
	rm -f main.o marks.o marks-demo
