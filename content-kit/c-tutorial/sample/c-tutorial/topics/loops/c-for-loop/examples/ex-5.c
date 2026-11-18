#include <stdio.h>

int main(void)
{
    int value;
    int total = 0;
    int count = 0;

    printf("Enter marks one by one (0 to stop):\n");
    for (;;) { /* no condition: runs until break */
        if (scanf("%d", &value) != 1 || value == 0) {
            break;
        }
        if (value < 0 || value > 100) {
            printf("Skipping %d (marks must be 0-100)\n", value);
            continue;
        }
        total += value;
        count++;
    }

    if (count > 0) {
        printf("%d marks entered, average = %.2f\n", count, (double)total / count);
    } else {
        printf("No marks entered.\n");
    }
    return 0;
}
