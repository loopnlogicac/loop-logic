#include <stdio.h>

int sum_readonly(const int *scores, size_t n)
{
    int total = 0;
    for (size_t i = 0; i < n; i++) {
        total += scores[i];
    }
    return total;
}

int main(void)
{
    int scores[] = {10, 20, 30};
    printf("%d\n", sum_readonly(scores, 3));
    return 0;
}
