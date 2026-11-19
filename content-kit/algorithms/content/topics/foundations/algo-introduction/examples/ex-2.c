#include <stdio.h>


int main(void)
{
    int a[] = {17, 43, 12, 43};
    int largest = a[0];
    for (int i = 1; i < 4; i++) {
        if (a[i] > largest) {
            largest = a[i];
        }
    }
    printf("largest = %d\n", largest);
    return 0;
}
