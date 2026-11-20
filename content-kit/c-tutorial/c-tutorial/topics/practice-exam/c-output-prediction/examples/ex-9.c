#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int i = 0;
    for (; i < 5; ++i) {
        if (i == 2) {
            break;
        }
    }
    printf("%d\n", i);
    return 0;
}
