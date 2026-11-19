#include <stdio.h>

int main(void)
{
    int ready = 0;
    if (!ready) {
        goto finished;
    }
    puts("Work");
    finished:
    puts("End");
    return 0;
}
