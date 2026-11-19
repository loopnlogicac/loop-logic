#include <stdio.h>

int main(void)
{
    int i = 1;
    while (i <= 3) {
        printf("%d\n", i);
        i++;
    }
    printf("Stop=%d\n", i);
    return 0;
}
