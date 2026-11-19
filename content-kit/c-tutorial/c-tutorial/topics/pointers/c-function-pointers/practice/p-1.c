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
    int mode, a, b;
    puts("Mode and operands:");
    if (scanf("%d %d %d", &mode, &a, &b) != 3 || mode < 0 || mode > 1 ||
        a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int (*ops[])(int, int) = {add_values, subtract_values};
    printf("%d\n", ops[mode](a, b));
    return 0;
}
