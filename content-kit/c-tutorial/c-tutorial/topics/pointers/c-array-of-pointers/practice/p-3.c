#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *names[] = {"A", "Campus", "Lab"};
    int start;
    puts("Starting entry:");
    if (scanf("%d", &start) != 1 || start < 0 || start > 2) {
        return 1;
    }
    size_t best = (size_t)start;
    for (size_t i = best + 1; i < 3; i++) {
        if (strlen(names[i]) > strlen(names[best])) {
            best = i;
        }
    }
    puts(names[best]);
    return 0;
}
