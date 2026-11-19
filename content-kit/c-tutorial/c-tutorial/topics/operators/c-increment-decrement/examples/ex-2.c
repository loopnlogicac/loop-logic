#include <stdio.h>

int main(void)
{
    int ticket = 4;
    int issued = ++ticket;
    printf("Issued=%d Current=%d\n", issued, ticket);
    return 0;
}
