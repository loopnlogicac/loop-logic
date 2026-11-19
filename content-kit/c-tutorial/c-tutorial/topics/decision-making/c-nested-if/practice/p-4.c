#include <stdio.h>

int main(void)
{
    int year;
    printf("Input: ");
    if (scanf("%d", &year) != 1 || year < 1 || year > 9999) {
        return 1;
    }
    int leap = 0;
    if (year % 4 == 0) {
        if (year % 100 != 0) {
            leap = 1;
        } else {
            if (year % 400 == 0) {
                leap = 1;
            }
        }
    }
    printf("%d\n", leap);
    return 0;
}
