#include <stdio.h>

int main(void)
{
    #if defined(__linux__)
        const char *platform = "Linux";
    #elif defined(_WIN32)
        const char *platform = "Windows";
    #else
        const char *platform = "other";
    #endif
    printf("Platform: %s\n", platform);
    return 0;
}
