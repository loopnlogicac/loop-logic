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
    int (*wrong)(int) = (int (*)(int))add_values;
    printf("%d\n", wrong(3));
    return 0;
}
