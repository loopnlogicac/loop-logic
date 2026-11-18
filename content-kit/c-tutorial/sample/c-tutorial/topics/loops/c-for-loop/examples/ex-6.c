#include <stdio.h>

int main(void)
{
    int i;

    /* MISTAKE: the semicolon ends the loop, so the block below runs once */
    for (i = 1; i <= 5; i++);
        printf("i = %d\n", i);

    return 0;
}
