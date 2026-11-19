#include <stdio.h>

int main(void)
{
    char course[16], section[16];
    puts("Course and section:");
    if (scanf("%15s %15s", course, section) != 2) {
        return 1;
    }
    printf("%s-%s\n", course, section);
    return 0;
}
