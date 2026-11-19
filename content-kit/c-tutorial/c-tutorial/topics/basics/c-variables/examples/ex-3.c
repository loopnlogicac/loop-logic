#include <stdio.h>

int main(void)
{
    static int visits;
    printf("Visits = %d\n", visits);
    return 0;
}
