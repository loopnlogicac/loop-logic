#include <stdio.h>

void subtotal(void)
{
    int value = 10;
    value += 5;
    printf("%d\n", value);
}

int main(void)
{
    int repeats;
    puts("Repetitions:");
    if (scanf("%d", &repeats) != 1 || repeats < 0 || repeats > 10) {
        return 1;
    }
    for (int i = 0; i < repeats; i++) {
        subtotal();
    }
    return 0;
}
