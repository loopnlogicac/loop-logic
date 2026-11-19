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
    int (*operation)(int, int) = add_values;
    printf("%d %d\n", operation(4, 5), (*operation)(2, 3));
    return 0;
}
