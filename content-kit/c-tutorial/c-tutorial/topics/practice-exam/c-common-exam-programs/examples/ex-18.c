#include <stdio.h>

int main(void)
{
    int a[2][3];
    for (int i = 0; i < 2; ++i) {
        for (int j = 0; j < 3; ++j) {
            if (scanf("%d", &a[i][j]) != 1) {
                puts("invalid");
                return 0;
            }
        }
    }
    for (int j = 0; j < 3; ++j) {
        printf("%d %d\n", a[0][j], a[1][j]);
    }
    return 0;
}
