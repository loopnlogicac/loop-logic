#include <stdio.h>

void hanoi(int n, char source, char spare, char target)
{
    if (n == 0) {
        return;
    }
    hanoi(n - 1, source, target, spare);
    printf("%c -> %c\n", source, target);
    hanoi(n - 1, spare, source, target);
}

int main(void)
{
    int n;
    puts("Disks:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 5) {
        return 1;
    }
    hanoi(n, 'A', 'B', 'C');
    return 0;
}
