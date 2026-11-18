#include <stdio.h>

int main(void)
{
    int balance = -5;
    if (balance) {
        puts("Nonzero");
    }
    if (balance < 0) {
        puts("Negative");
    }
    return 0;
}
