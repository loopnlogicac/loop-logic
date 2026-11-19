#include <stdio.h>

int main(void)
{
    int bill, budget;
    printf("Input: ");
    if (scanf("%d %d", &bill, &budget) != 2 || bill < 0 || bill > 1000 || budget < 0
        || budget > 1000) {
        return 1;
    }
    printf("%d\n", bill <= budget);
    return 0;
}
