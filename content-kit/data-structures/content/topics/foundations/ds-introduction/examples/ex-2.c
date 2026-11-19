#include <stdio.h>

typedef struct {
    int marks[2];
    int count;
} Bag;

int add_mark(Bag *bag, int mark)
{
    if (bag->count == 2) {
        return 0;
    }
    bag->marks[bag->count++] = mark;
    return 1;
}

int main(void)
{
    Bag bag = {{0}, 0};
    printf("Added: %d\n", add_mark(&bag, 72));
    printf("Added: %d\n", add_mark(&bag, 85));
    printf("Added: %d\n", add_mark(&bag, 91));
    printf("Count: %d\n", bag.count);
    return 0;
}
