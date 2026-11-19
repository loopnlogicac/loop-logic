#include <stdio.h>


int main(void)
{
    int a[] = {1, 3, 2, 4, 5};
    int shifts = 0;
    for (int i = 1; i < 5; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
            shifts++;
        }
        a[j + 1] = key;
    }
    printf("shifts = %d\n", shifts);
    return 0;
}
