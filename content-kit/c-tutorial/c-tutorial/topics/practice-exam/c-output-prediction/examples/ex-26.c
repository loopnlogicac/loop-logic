#include <stdio.h>
#include <string.h>
#include <stddef.h>

#define FEATURE 1
#if FEATURE
#define FEATURE_VALUE 7
#else
#define FEATURE_VALUE 3
#endif

int main(void)
{
    int value = FEATURE_VALUE;
    printf("%d\n", value);
    return 0;
}
