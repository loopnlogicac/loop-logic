#include <stdio.h>
#include <string.h>

int main(void)
{
    char names[3][12];
    puts("Sorted names:");
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%11s", names[i]) != 1) {
            return 1;
        }
    }
    for (size_t i = 0; i < 3; i++) {
        if (i == 0 || strcmp(names[i], names[i - 1]) != 0) {
            puts(names[i]);
        }
    }
    return 0;
}
