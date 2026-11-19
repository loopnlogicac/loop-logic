#include <stdio.h>

int main(void)
{
    char op;
    printf("Input: ");
    if (scanf(" %c", &op) != 1) {
        return 1;
    }
    switch (op) {
        case '+':
            puts("Add");
            break;
        case '-':
            puts("Subtract");
            break;
        default:
            puts("Other");
            break;
    }
    return 0;
}
