#include <stdio.h>

int *pair(int start)
{
    static int result[2];
    result[0] = start;
    result[1] = start + 1;
    return result;
}

int main(void)
{
    int *first = pair(4);
    printf("%d %d\n", first[0], first[1]);
    int *second = pair(9);
    printf("%d %d %d\n", first[0], second[0], second[1]);
    return 0;
}
