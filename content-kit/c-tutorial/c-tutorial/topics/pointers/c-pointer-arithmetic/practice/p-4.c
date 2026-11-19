#include <stdio.h>

int main(void)
{
    int values[] = {2, 4, 6, 8, 10};
    int begin, end;
    puts("Reverse slice:");
    if (scanf("%d %d", &begin, &end) != 2 || begin < 0 || end > 5 || begin > end) {
        return 1;
    }
    int *start = values + begin;
    int *p = values + end;
    int first = 1;
    while (p != start) {
        --p;
        printf("%s%d", first ? "" : " ", *p);
        first = 0;
    }
    putchar('\n');
    return 0;
}
