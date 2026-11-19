#include <stdio.h>
#include <stdlib.h>

static int compare_int(const void *left, const void *right)
{
    const int a = *(const int *)left;
    const int b = *(const int *)right;
    return (a > b) - (a < b);
}

int main(void)
{
    int rolls[] = {103, 101, 104, 102};
    size_t count = sizeof rolls / sizeof rolls[0];
    qsort(rolls, count, sizeof rolls[0], compare_int);
    for (size_t i = 0; i < count; ++i) {
        printf("%d%c", rolls[i], i + 1 == count ? '\n' : ' ');
    }
    int key = 103;
    const int *found = bsearch(&key, rolls, count, sizeof rolls[0], compare_int);
    printf("Found: %d\n", found != NULL ? *found : -1);
    return 0;
}
