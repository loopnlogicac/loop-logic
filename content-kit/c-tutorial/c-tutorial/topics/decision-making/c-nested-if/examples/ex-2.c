#include <stdio.h>

int main(void)
{
    int a = 9;
    int b = 9;
    int c = 4;
    int best;
    if (a >= b) {
        if (a >= c) {
            best = a;
        } else {
            best = c;
        }
    } else {
        if (b >= c) {
            best = b;
        } else {
            best = c;
        }
    }
    printf("%d\n", best);
    return 0;
}
