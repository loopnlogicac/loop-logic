#include <stdio.h>

int main(void)
{
    int target;
    printf("Input: ");
    if (scanf("%d", &target) != 1 || target < 1 || target > 20) {
        return 1;
    }
    int found = 0;
    for (int row = 1; row <= 3 && !found; row++) {
        for (int col = 1; col <= 3; col++) {
            if (row * col == target) {
                printf("%d %d\n", row, col);
                found = 1;
                break;
            }
        }
    }
    if (!found) {
        puts("None");
    }
    return 0;
}
