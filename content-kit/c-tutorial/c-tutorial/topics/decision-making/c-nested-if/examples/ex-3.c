#include <stdio.h>

int main(void)
{
    int year = 1900;
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
