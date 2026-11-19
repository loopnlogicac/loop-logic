#include <stdio.h>
#include <stdlib.h>

static int compare(const void *left, const void *right)
{
    int a = *(const int *)left, b = *(const int *)right;
    return (a > b) - (a < b);
}
int main(void)
{
    int n, target, values[100];
    puts("n, target, then values (n 0..100, values/target -1000..1000):");
    if (scanf("%d%d", &n, &target) != 2 || n < 0 || n > 100 ||
        target < -1000 || target > 1000) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -1000 || values[i] > 1000) {
            return 1;
        }
    }
    qsort(values, (size_t)n, sizeof values[0], compare);
    int left = 0, right = n - 1, found = 0;
    while (left < right) {
        int sum = values[left] + values[right];
        if (sum == target) {
            found = 1;
            break;
        }
        if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    puts(found ? "YES" : "NO");
    return 0;
}
