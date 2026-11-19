#include <stdio.h>

int main(void)
{
    int enabled;
    puts("Show build stamp:");
    if (scanf("%d", &enabled) != 1 || enabled < 0 || enabled > 1) {
        return 1;
    }
    if (enabled) {
        printf("%zu %zu\n", sizeof __DATE__ - 1, sizeof __TIME__ - 1);
    } else {
        puts("hidden");
    }
    return 0;
}
