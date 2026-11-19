#include <stdio.h>



int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }

    int best = values[0], left = 0, right = 1;
    for (int lo = 0; lo < n; lo++) {
        int sum = 0;
        for (int hi = lo; hi < n; hi++) {
            sum += values[hi];
            if (sum > best) { best = sum; left = lo; right = hi + 1; }
        }
    }
    printf("best = %d, range = %d %d\n", best, left, right);
    return 0;
}
