#include <stdio.h>

int main(void)
{
    int choice;
    printf("Input: ");
    if (scanf("%d", &choice) != 1 || choice < 0 || choice > 9) {
        return 1;
    }
    switch (choice) {
        case 1:
            puts("Start");
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
