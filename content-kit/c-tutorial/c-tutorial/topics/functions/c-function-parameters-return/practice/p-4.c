#include <stdio.h>

int passes(int mark)
{
    return mark >= 40;
}

int main(void)
{
    int a, b, c;
    puts("Three marks:");
    if (scanf("%d%d%d", &a, &b, &c) != 3 || a < 0 || a > 100 ||
        b < 0 || b > 100 || c < 0 || c > 100) {
        return 1;
    }
    printf("%d\n", passes(a) + passes(b) + passes(c));
    return 0;
}
