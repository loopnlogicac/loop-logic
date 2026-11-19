#include <stdio.h>

int main(void)
{
    int values[] = {2, 4, 6, 8, 10};
    int begin, end;
    puts("Slice:");
    if (scanf("%d %d", &begin, &end) != 2 || begin < 0 || end > 5 || begin > end) {
        return 1;
    }
    int sum = 0;
    for (int *p = values + begin; p != values + end; p++) {
        sum += *p;
    }
    printf("%d\n", sum);
    return 0;
}
