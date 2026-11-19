#include <stdio.h>


int main(void)
{
    int n, target, values[16], count = 0;
    puts("n, target, then values (n 0..16, values/target -100..100):");
    if (scanf("%d%d", &n, &target) != 2 || n < 0 || n > 16 || target < -100 || target > 100) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    for (unsigned mask = 0; mask < (1u << n); mask++) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            if (mask & (1u << i)) {
                sum += values[i];
            }
        }
        if (sum == target) {
            count++;
        }
    }
    printf("Count: %d\n", count);
    return 0;
}
