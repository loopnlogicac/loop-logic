#include <stdio.h>

int main(void)
{
    int bill;
    printf("Input: ");
    if (scanf("%d", &bill) != 1 || bill < 0 || bill > 1000) {
        return 1;
    }
    if (bill >= 500) {
        bill -= 50;
    }
    printf("%d\n", bill);
    return 0;
}
