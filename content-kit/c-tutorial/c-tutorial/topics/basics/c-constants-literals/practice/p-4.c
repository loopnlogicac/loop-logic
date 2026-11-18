#include <stdio.h>

enum { LAB_HOURS = 3 };

int main(void)
{
    int days;
    printf("Input: ");
    if (scanf("%d", &days) != 1) {
        return 1;
    }
    printf("Hours=%d\n", days * LAB_HOURS);
    return 0;
}
