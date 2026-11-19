#include <stdio.h>


int main(void)
{
    int a[] = {7, 3, 5, 3, 1};
    int count = 0;
    for (int i = 0; i < 5; i++) {
        count += a[i] == 3;
    }
    printf("matches = %d\n", count);
    return 0;
}
