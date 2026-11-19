#include <stdio.h>
#include <errno.h>

int main(void)
{
    errno = 0;
    FILE *fees = fopen("missing-directory/fees.txt", "r");
    if (fees == NULL) {
        int saved = errno;
        puts("Open failed");
        errno = saved;
        perror("fees");
        return 1;
    }
    return fclose(fees) == 0 ? 0 : 1;
}
