#include <stdio.h>

int accept(int reading)
{
    static int accepted;
    if (reading >= 0) {
        accepted++;
    }
    return accepted;
}

int main(void)
{
    int n, count = 0;
    puts("Readings:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 8) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        int reading;
        if (scanf("%d", &reading) != 1 || reading < -20 || reading > 100) {
            return 1;
        }
        count = accept(reading);
    }
    printf("%d\n", count);
    return 0;
}
