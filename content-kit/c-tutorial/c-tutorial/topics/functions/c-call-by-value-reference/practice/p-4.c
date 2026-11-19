#include <stdio.h>

void swap(int *a, int *b)
{
    int temporary = *a;
    *a = *b;
    *b = temporary;
}

int main(void)
{
    int value;
    puts("Number:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    swap(&value, &value);
    printf("%d\n", value);
    return 0;
}
