#include <stdio.h>

static long long squared(int x1, int y1, int x2, int y2)
{
    long long dx = (long long)x1 - x2, dy = (long long)y1 - y2;
    return dx * dx + dy * dy;
}

int main(void)
{
    int x[] = {0, 5, 2, 3, 9}, y[] = {0, 5, 1, 1, 9};
    long long best = 9000000000000000000LL;
    for (int i = 0; i < 5; i++) {
        for (int j = i + 1; j < 5; j++) {
            long long d = squared(x[i], y[i], x[j], y[j]);
            if (d < best) { best = d; }
        }
    }
    printf("squared distance = %lld\n", best);
    return 0;
}
