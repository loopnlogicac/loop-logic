#include <stdio.h>

int main(void)
{
    int a[2][2];
    int b[2][2];
    for (int k = 0; k < 2; ++k) {
        for (int i = 0; i < 2; ++i) {
            for (int j = 0; j < 2; ++j) {
                int *cell = k == 0 ? &a[i][j] : &b[i][j];
                if (scanf("%d", cell) != 1 || *cell < -100 || *cell > 100) {
                    puts("invalid");
                    return 0;
                }
            }
        }
    }
    for (int i = 0; i < 2; ++i) {
        printf("%d %d\n", a[i][0] + b[i][0], a[i][1] + b[i][1]);
    }
    return 0;
}
