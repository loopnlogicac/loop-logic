#include <stdio.h>

#define SESSION_MINUTES 30
#undef SESSION_MINUTES
#define SESSION_MINUTES 45

int main(void)
{
    int sessions;
    puts("Sessions:");
    if (scanf("%d", &sessions) != 1 || sessions < 0 || sessions > 20) {
        return 1;
    }
    printf("%d\n", sessions * SESSION_MINUTES);
    return 0;
}
