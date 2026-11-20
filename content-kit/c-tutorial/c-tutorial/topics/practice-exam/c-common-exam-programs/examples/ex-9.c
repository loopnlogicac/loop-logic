#include <stdio.h>

int main(void)
{
    long n;
    if (scanf("%ld", &n) != 1 || n < 0 || n > 999999) {
        puts("invalid");
        return 0;
    }
    long original = n;
    long reversed = 0;
    do {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    } while (n != 0);
    puts(original == reversed ? "palindrome" : "not palindrome");
    return 0;
}
