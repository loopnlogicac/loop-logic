#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    char *end;
    errno = 0;
    (void)strtol("999999999999999999999999999999999999999999999999999999", &end, 10);
    int saved = errno;
    printf("Had digits: %d\n", *end == '\0');
    printf("Range failure: %d\n", saved == ERANGE);
    if (saved == ERANGE) {
        errno = saved;
        perror("mark conversion");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
