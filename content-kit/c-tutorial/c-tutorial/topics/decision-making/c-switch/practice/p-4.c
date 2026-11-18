#include <stdio.h>

int main(void)
{
    int a, b;
    char operation;
    printf("Input: ");
    if (scanf("%d %c %d", &a, &operation, &b) != 3
        || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    switch (operation) {
        case '+':
            printf("%d\n", a + b);
            break;
        case '-':
            printf("%d\n", a - b);
            break;
        case '*':
            printf("%d\n", a * b);
            break;
        case '/':
            if (b == 0) {
                puts("Zero divisor");
            } else {
                printf("%d\n", a / b);
            }
            break;
        default:
            puts("Unknown");
            break;
    }
    return 0;
}
