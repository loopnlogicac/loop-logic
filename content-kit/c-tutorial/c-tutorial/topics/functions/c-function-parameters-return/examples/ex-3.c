#include <stdio.h>

void show_mark(int mark)
{
    if (mark < 0 || mark > 100) {
        puts("Invalid mark");
        return;
    }
    printf("Mark: %d\n", mark);
}

int main(void)
{
    show_mark(-1);
    show_mark(85);
    return 0;
}
