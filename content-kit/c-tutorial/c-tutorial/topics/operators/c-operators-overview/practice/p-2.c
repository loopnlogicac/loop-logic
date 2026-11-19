#include <stdio.h>

int main(void)
{
    int debt;
    printf("Input: ");
    if (scanf("%d", &debt) != 1 || debt < 0 || debt > 1000) {
        return 1;
    }
    printf("Signed=%d\n", -debt);
    return 0;
}
