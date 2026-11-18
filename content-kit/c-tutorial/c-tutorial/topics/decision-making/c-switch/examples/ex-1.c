#include <stdio.h>

int main(void)
{
    int choice = 2;
    switch (choice) {
        case 1:
            puts("Balance");
            break;
        case 2:
            puts("Help");
            break;
        default:
            puts("Unknown");
            break;
    }
    return 0;
}
