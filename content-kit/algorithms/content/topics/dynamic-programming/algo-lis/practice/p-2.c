#include <stdio.h>

static int fast_lis(const int values[], int n, int answer[])
{
    int tail[16], tail_index[16], previous[16], length = 0;
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (tail[mid] < values[i]) { lo = mid + 1; } else { hi = mid; }
        }
        previous[i] = lo == 0 ? -1 : tail_index[lo - 1];
        tail[lo] = values[i]; tail_index[lo] = i;
        if (lo == length) { length++; }
    }
    int at = length == 0 ? -1 : tail_index[length - 1];
    for (int k = length - 1; k >= 0; k--) { answer[k] = values[at]; at = previous[at]; }
    return length;
}

int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }
    int answer[16];
    int length = fast_lis(values, n, answer);

    printf("length = %d\n", length);
    for (int i = 0; i < length; i++) { printf("%s%d", i ? " " : "", answer[i]); }
    putchar('\n');
    return 0;
}
