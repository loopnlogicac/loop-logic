#include <stdio.h>

int main(void)
{
    int present;
    printf("Input: ");
    if (scanf("%d", &present) != 1 || present < -10 || present > 10) {
        return 1;
    }
    printf("%d\n", !present);
    return 0;
}
