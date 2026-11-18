#include <stdio.h>

/** Return taka for 0 to 100 tickets, each priced at 20 taka. */
int ticket_cost(int tickets)
{
    return tickets * 20;
}

int main(void)
{
    printf("Cost = %d\n", ticket_cost(3));
    return 0;
}
