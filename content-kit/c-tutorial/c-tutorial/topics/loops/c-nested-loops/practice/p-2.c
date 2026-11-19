#include <stdio.h>

int main(void)
{
    int n, m;
    printf("Input: ");
    if (scanf("%d %d", &n, &m) != 2 || n < 0 || n > 20 || m < 0 || m > 20) {
        return 1;
    }
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            count++;
        }
    }
    printf("%d\n", count);
    return 0;
}
