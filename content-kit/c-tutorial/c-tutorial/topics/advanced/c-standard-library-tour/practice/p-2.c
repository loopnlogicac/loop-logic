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
    int rolls[] = {101, 103, 107, 109};
    int key;
    if (scanf("%d", &key) != 1) {
        puts("invalid");
        return 0;
    }
    const int *found = bsearch(&key, rolls, 4, sizeof rolls[0], compare_int);
    puts(found != NULL ? "found" : "missing");
    return 0;
}
