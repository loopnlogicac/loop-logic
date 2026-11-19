#include <stdio.h>


int main(void)
{
    const int values[] = {2, 3, 5};
    int reachable[11] = {1};
    for (int i = 0; i < 3; i++) {
        for (int sum = 10; sum >= values[i]; sum--) {
            reachable[sum] = reachable[sum] || reachable[sum - values[i]];
        }
    }
    for (int sum = 0; sum <= 10; sum++) {
        if (reachable[sum]) {
            printf("%d ", sum);
        }
    }
    puts("");
    return 0;
}
