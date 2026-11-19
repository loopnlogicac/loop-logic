#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *names[] = {"A", "Campus", "Lab"};
    for (size_t i = 0; i < 3; i++) {
        printf("%s:%zu\n", names[i], strlen(names[i]));
    }
    return 0;
}
