#include <stdio.h>

int main(void)
{
    int fee;
    printf("Enter paid fee: ");
    if (scanf("%d", &fee) != 1 || fee < 0 || fee > 10000) {
        fputs("Invalid fee\n", stderr);
        return 1;
    }
    fprintf(stdout, "Receipt: %d BDT\n", fee);
    return 0;
}
