#include <stdio.h>

int main(void)
{
    int balance, deposit;
    printf("Input: ");
    if (scanf("%d %d", &balance, &deposit) != 2 || balance < 0 || balance > 1000 || deposit < 0
        || deposit > 1000) {
        return 1;
    }
    balance += deposit;
    printf("%d\n", balance);
    return 0;
}
