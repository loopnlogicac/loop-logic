#include <stdio.h>

int main(void)
{
    int count;
    printf("Input: ");
    if (scanf("%d", &count) != 1) {
        return 1;
    }
    const int fare = 15;
    printf("Fare=%d\n", count * fare);
    return 0;
}
