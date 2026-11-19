#include <stdio.h>

static int n, target, values[16], chosen[16];
static unsigned long long count;
static void subsets(int pos, int sum)
{
    if (sum > target) {
        return; /* Nonnegative values cannot repair an excess. */
    }
    if (pos == n) {
        if (sum == target) {
            count++;
            printf("Indices:");
            for (int i = 0; i < n; i++) {
                if (chosen[i]) {
                    printf(" %d", i);
                }
            }
            puts("");
        }
        return;
    }
    chosen[pos] = 0;
    subsets(pos + 1, sum);
    chosen[pos] = 1;
    subsets(pos + 1, sum + values[pos]);
    chosen[pos] = 0;
}
int main(void)
{
    puts("n, target, then nonnegative values (n 0..16, values/target 0..100):");
    if (scanf("%d%d", &n, &target) != 2 || n < 0 || n > 16 || target < 0 || target > 100) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < 0 || values[i] > 100) {
            return 1;
        }
    }
    subsets(0, 0);
    printf("Count: %llu\n", count);
    return 0;
}
