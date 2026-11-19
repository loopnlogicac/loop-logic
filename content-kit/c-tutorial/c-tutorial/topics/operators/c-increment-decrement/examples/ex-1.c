#include <stdio.h>

int main(void)
{
    int ticket = 4;
    int issued = ticket++;
    printf("Issued=%d Next=%d\n", issued, ticket);
    return 0;
}
