#include <stdio.h>
#include <string.h>
#include <stddef.h>

static int fresh_count(void)
{
    int count = 0;
    return ++count;
}

int main(void)
{
    int first = fresh_count();
    int second = fresh_count();
    printf("%d %d\n", first, second);
    return 0;
}
