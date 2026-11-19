#include <stdio.h>

int main(void)
{
    int counter;
    printf("Input: ");
    if (scanf("%d", &counter) != 1 || counter < 0 || counter > 1000) {
        return 1;
    }
    int issued = counter++;
    printf("%d %d\n", issued, counter);
    return 0;
}
