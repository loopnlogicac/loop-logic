#include <stdio.h>

int add(int a, int b)
{
    return a + b;
}

int gap(int a, int b)
{
    return a - b;
}

int main(void)
{
    int first, second;
    printf("Input: ");
    if (scanf("%d %d", &first, &second) != 2) {
        return 1;
    }
    printf("Sum=%d\nGap=%d\n", add(first, second), gap(first, second));
    return 0;
}
