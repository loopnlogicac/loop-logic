#include <stdio.h>

int main(int argc, char *argv[])
{
    printf("User arguments: %d\n", argc > 0 ? argc - 1 : 0);
    for (int i = 1; i < argc; ++i) {
        printf("%d: %s\n", i, argv[i]);
    }
    printf("Sentinel: %d\n", argv[argc] == NULL);
    return 0;
}
