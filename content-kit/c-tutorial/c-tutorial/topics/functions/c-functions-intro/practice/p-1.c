#include <stdio.h>

int ticket_cost(int count)
{
    return count * 15;
}

int main(void)
{
    int count;
    puts("Tickets:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 100) {
        return 1;
    }
    printf("Cost = %d\n", ticket_cost(count));
    return 0;
}
