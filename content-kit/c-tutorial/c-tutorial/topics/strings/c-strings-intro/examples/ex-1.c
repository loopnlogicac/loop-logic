#include <stdio.h>

int main(void)
{
    char campus[] = "DIU";
    for (size_t i = 0; i < 3; i++) {
        printf("%zu: %c\n", i, campus[i]);
    }
    printf("terminator: %d\n", campus[3] == '\0');
    return 0;
}
