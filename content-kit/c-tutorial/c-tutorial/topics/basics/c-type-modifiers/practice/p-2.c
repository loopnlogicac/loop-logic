#include <stdio.h>

int main(void)
{
    long tally;
    printf("Input: ");
    if (scanf("%ld", &tally) != 1) {
        return 1;
    }
    printf("Tally=%ld\n", tally);
    return 0;
}
