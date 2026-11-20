#include <stdio.h>

int main(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 100 || n > 999) {
        puts("invalid");
        return 0;
    }
    int a = n / 100;
    int b = n / 10 % 10;
    int c = n % 10;
    int cubes = a * a * a + b * b * b + c * c * c;
    puts(cubes == n ? "Armstrong" : "not Armstrong");
    return 0;
}
