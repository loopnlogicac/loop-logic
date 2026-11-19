#include <stdio.h>

int main(void)
{
    int cash, first, second;
    printf("Input: ");
    if (scanf("%d %d %d", &cash, &first, &second) != 3 || cash < 0 || cash > 1000 || first < 0
        || first > 1000 || second < 0 || second > 1000) {
        return 1;
    }
    printf("%d\n", cash - first - second);
    return 0;
}
