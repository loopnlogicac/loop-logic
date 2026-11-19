#include <stdio.h>


int main(void)
{
    int pairs = 0;
    for (int i = 1; i <= 8; i++) {
        for (int j = 0; j < i; j++) {
            pairs++;
        }
    }
    printf("pairs = %d\n", pairs);
    return 0;
}
