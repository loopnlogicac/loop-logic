#include <stdio.h>

int main(void)
{
    int count;
    puts("Diagnostic count:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 5) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
    #line 50 "repeat.c"
        printf("%d %d\n", i, __LINE__);
    }
    return 0;
}
