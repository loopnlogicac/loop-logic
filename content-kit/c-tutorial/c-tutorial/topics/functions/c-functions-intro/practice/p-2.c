#include <stdio.h>

void separator(int width)
{
    for (int i = 0; i < width; i++) {
        putchar('=');
    }
    putchar('\n');
}

int main(void)
{
    int width;
    puts("Width:");
    if (scanf("%d", &width) != 1 || width < 1 || width > 30) {
        return 1;
    }
    separator(width);
    return 0;
}
