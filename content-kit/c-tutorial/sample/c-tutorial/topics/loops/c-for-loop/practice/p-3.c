#include <stdio.h>

int main(void)
{
    int n;
    int count = 0;
    long long sum = 0;

    if (scanf("%d", &n) != 1) {
        return 1;
    }
    for (int i = 1; i < n; i++) {
        if (i % 3 == 0 || i % 5 == 0) {
            count++;
            sum += i;
        }
    }
    printf("count = %d, sum = %lld\n", count, sum);
    return 0;
}
