#include <stdio.h>

int main(void)
{
    int total = 10;
    int count = 0;
    int large = count != 0 && total / count > 2;
    printf("%d\n", large);
    return 0;
}
