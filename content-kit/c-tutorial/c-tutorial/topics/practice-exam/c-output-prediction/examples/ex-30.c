#include <stdio.h>
#include <string.h>
#include <stddef.h>

static int shadow_count(void)
{
    static int count;
    {
        int count = 9;
        ++count;
    }
    return ++count;
}

int main(void)
{
    int first = shadow_count();
    int second = shadow_count();
    printf("%d %d\n", first, second);
    return 0;
}
