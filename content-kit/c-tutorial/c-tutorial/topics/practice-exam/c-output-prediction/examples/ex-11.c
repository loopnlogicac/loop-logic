#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int count = 0;
    for (int i = 1; i <= 3; ++i) {
        for (int j = 0; j < i; ++j) {
            ++count;
        }
    }
    printf("%d\n", count);
    return 0;
}
