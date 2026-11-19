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
    int (*operations[])(int, int) = {add_values, subtract_values, multiply_values};
    for (size_t i = 0; i < 3; i++) {
        printf("%d\n", operations[i](6, 2));
    }
    return 0;
}
