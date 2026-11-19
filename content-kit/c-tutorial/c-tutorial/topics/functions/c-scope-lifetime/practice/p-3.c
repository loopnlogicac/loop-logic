#include <stdio.h>

int next_ticket(void)
{
    static int last = 100;
    last++;
    return last;
}

int main(void)
{
    int count;
    puts("Count:");
    if (scanf("%d", &count) != 1 || count < 1 || count > 10) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        printf("%d\n", next_ticket());
    }
    return 0;
}
