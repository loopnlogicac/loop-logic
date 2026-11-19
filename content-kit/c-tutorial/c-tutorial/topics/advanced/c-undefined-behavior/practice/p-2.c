#include <stdio.h>
#include <limits.h>

int main(void)
{
    int left;
    int right;
    if (scanf("%d%d", &left, &right) != 2 || right == 0 ||
        (left == INT_MIN && right == -1)) {
        puts("invalid");
        return 0;
    }
    printf("%d\n", left / right);
    return 0;
}
