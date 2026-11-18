#include <stdio.h>

int main(void)
{
    int difference = 0;
    if (difference < 0) {
        puts("Negative");
    } else if (difference > 0) {
        puts("Positive");
    } else {
        puts("Zero");
    }
    return 0;
}
