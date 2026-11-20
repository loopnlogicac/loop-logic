#include <stdio.h>

int main(void)
{
    int year;
    if (scanf("%d", &year) != 1 || year < 1 || year > 9999) {
        puts("invalid");
        return 0;
    }
    int leap = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    puts(leap ? "leap" : "common");
    return 0;
}
