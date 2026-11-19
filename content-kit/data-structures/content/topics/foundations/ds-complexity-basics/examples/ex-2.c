#include <stdio.h>

int main(void)
{
    for (int n = 2; n <= 8; n *= 2) {
        int pairs = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                pairs++;
            }
        }
        printf("n=%d pairs=%d\n", n, pairs);
    }
    return 0;
}
