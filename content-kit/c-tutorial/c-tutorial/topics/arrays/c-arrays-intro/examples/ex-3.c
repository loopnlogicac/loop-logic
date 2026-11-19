#include <stdio.h>



int main(void)
{
    int rolls[] = {11, 15, 23, 28, 31};
    size_t count = sizeof rolls / sizeof rolls[0];
    printf("%zu\n", count);
    return 0;
}
