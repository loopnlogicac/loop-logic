#include <stdio.h>

int main(void)
{
    int total = 45;
    int within = total <= 50;
    printf("%d %s\n", within, within ? "Ready" : "Wait");
    return 0;
}
