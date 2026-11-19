#include <stdio.h>
#include "marks.h"

int main(void)
{
    int n;
    int marks[10];
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &marks[i]) != 1 || marks[i] < 0 || marks[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    printf("%d\n", passed_count(marks, n));
    return 0;
}
