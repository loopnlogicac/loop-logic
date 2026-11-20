#include <limits.h>
#include <stdio.h>

static int add_int(int left, int right, int *answer)
{
    if ((right > 0 && left > INT_MAX - right) ||
        (right < 0 && left < INT_MIN - right)) {
        return 0;
    }
    *answer = left + right;
    return 1;
}

int main(void)
{
    int answer = 99;
    printf("Accepted: %d\n", add_int(INT_MAX, 1, &answer));
    printf("Retained: %d\n", answer);
    if (add_int(20, -8, &answer)) {
        printf("Safe sum: %d\n", answer);
    }
    return 0;
}
