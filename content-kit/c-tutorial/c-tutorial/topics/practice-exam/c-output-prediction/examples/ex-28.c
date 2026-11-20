#include <stdio.h>
#include <string.h>
#include <stddef.h>

static int next_count(void)
{
    static int count;
    return ++count;
}

int main(void)
{
    int first = next_count();
    int second = next_count();
    printf("%d %d\n", first, second);
    return 0;
}
