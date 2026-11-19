#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[21], b[21];
    puts("Two labels:");
    if (scanf("%20s %20s", a, b) != 2) {
        return 1;
    }
    int c = strcmp(a, b);
    printf("%d\n", (c > 0) - (c < 0));
    return 0;
}
