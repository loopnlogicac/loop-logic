#include <stdio.h>

union Value { int count; double amount; };

int main(void)
{
    int count;
    puts("Count:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 100) {
        return 1;
    }
    union Value value = {.count = count};
    printf("%d\n", value.count);
    return 0;
}
