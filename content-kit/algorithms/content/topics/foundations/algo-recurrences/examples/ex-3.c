#include <stdio.h>


int main(void)
{
    int n = 32;
    int calls = 1;
    while (n > 1) {
        n /= 2;
        calls++;
    }
    printf("calls = %d\n", calls);
    return 0;
}
