#include <stdio.h>

void descend(int n)
{
    printf("Enter %d\n", n);
    if (n > 0) {
        descend(n - 1);
    }
    printf("Leave %d\n", n);
}

int main(void)
{
    descend(3);
    return 0;
}
