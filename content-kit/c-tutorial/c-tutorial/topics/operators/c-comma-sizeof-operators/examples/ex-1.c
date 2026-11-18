#include <stdio.h>

int main(void)
{
    int counter = 3;
    int result = (counter++, counter * 2);
    printf("%d %d\n", result, counter);
    return 0;
}
