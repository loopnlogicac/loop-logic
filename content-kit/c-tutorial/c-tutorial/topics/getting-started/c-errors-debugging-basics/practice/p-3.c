#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    printf("a=%d b=%d\ntotal=%d\n", a, b, a + b);
    return 0;
}
