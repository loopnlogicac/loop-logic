#include <stdio.h>


int main(void)
{
    int m;
    puts("Palette size for a triangle (1..5):");
    if (scanf("%d", &m) != 1 || m < 1 || m > 5) {
        return 1;
    }
    int count = 0;
    for (int a = 1; a <= m; a++) {
        for (int b = 1; b <= m; b++) {
            for (int c = 1; c <= m; c++) {
                if (a != b && b != c && a != c) {
                    count++;
                }
            }
        }
    }
    printf("Labelled colourings: %d\n", count);
    return 0;
}
