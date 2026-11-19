#include <stdio.h>

int main(void)
{
    int values[] = {3, 4, 5};
    int total = 0;
    int *end = values + 3;
    for (int *p = values; p != end; p++) {
        total += *p;
    }
    printf("%d\n", total);
    return 0;
}
