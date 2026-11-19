#include <stdio.h>
#include <string.h>

int main(void)
{
    char names[3][12];
    size_t best = 0;
    puts("Labels:");
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%11s", names[i]) != 1) {
            return 1;
        }
        if (strlen(names[i]) > strlen(names[best])) {
            best = i;
        }
    }
    puts(names[best]);
    return 0;
}
