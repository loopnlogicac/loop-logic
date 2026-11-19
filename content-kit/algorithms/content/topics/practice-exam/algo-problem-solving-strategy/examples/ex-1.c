#include <stdio.h>


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
    int found = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (values[i] + values[j] == target) {
                found = 1;
            }
        }
    }
    puts(found ? "YES" : "NO");
    return 0;
}
