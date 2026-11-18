#include <stdio.h>

int main(void)
{
    int choice;
    printf("Choices (0 exits): ");
    do {
        puts("Menu");
        if (scanf("%d", &choice) != 1) {
            return 1;
        }
        if (choice == 1) {
            puts("Balance");
        } else if (choice != 0) {
            puts("Unknown");
        }
    } while (choice != 0);
    return 0;
}
