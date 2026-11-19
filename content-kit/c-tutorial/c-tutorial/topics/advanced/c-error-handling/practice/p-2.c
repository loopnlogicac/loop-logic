#include <stdio.h>

int main(void)
{
    int balance;
    int amount;
    if (scanf("%d%d", &balance, &amount) != 2 || balance < 0 || amount <= 0) {
        puts("invalid");
        return 0;
    }
    if (amount > balance) {
        puts("insufficient");
        return 0;
    }
    balance -= amount;
    printf("%d\n", balance);
    return 0;
}
