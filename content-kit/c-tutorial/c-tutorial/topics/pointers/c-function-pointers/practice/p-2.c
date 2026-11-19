#include <stdio.h>

int add_values(int a, int b) {
    return a + b;
}
int subtract_values(int a, int b) {
    return a - b;
}
int multiply_values(int a, int b) {
    return a * b;
}

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int (*multiply)(int, int) = multiply_values;
    printf("%d\n", multiply(a, b));
    return 0;
}
