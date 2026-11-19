#include <stdio.h>


int main(void)
{
    int n;
    unsigned long long nodes = 1, level = 1;
    puts("Binary decision depth (0..20):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    for (int depth = 1; depth <= n; depth++) {
        level *= 2;
        nodes += level;
    }
    printf("Leaves: %llu\nNodes: %llu\n", level, nodes);
    return 0;
}
