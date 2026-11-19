#include <stdio.h>

int main(void)
{
    char code[8];
    puts("Course code:");
    if (scanf("%7s", code) != 1) {
        return 1;
    }
    printf("Code = %s\n", code);
    return 0;
}
