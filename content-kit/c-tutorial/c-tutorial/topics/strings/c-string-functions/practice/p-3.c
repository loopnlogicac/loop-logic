#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[21], b[21], joined[16];
    puts("Parts:");
    if (scanf("%20s %20s", a, b) != 2) {
        return 1;
    }
    if (strlen(a) + strlen(b) >= sizeof joined) {
        puts("TOO LONG");
    } else {
        strcpy(joined, a);
        strcat(joined, b);
        puts(joined);
    }
    return 0;
}
