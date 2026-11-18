#include <stdio.h>

int main(void)
{
    int repeats;
    printf("Input: ");
    if (scanf("%d", &repeats) != 1 || repeats < 0 || repeats > 5) {
        return 1;
    }
    int count = 0;
    do {
        puts("Try");
        count++;
    } while (count < repeats);
    return 0;
}
