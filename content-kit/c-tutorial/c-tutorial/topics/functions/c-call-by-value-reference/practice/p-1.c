#include <stdio.h>

void swap(int *a, int *b)
{
    int temporary = *a;
    *a = *b;
    *b = temporary;
}

void order(int *a, int *b)
{
    if (*a > *b) {
        swap(a, b);
    }
}

int main(void)
{
    int a, b;
    puts("Scores:");
    if (scanf("%d%d", &a, &b) != 2 || a < 0 || a > 100 || b < 0 || b > 100) {
        return 1;
    }
    order(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}
