#include <stdio.h>

int main(void)
{
    char a[31], b[31], result[41];
    puts("Tokens:");
    if (scanf("%30s %30s", a, b) != 2) {
        return 1;
    }
    size_t n = 0, m = 0;
    while (a[n] != '\0') {
        n++;
    }
    while (b[m] != '\0') {
        m++;
    }
    if (n + m >= sizeof result) {
        puts("FULL");
        return 0;
    }
    for (size_t i = 0; i < n; i++) {
        result[i] = a[i];
    }
    for (size_t i = 0; i <= m; i++) {
        result[n + i] = b[i];
    }
    puts(result);
    return 0;
}
