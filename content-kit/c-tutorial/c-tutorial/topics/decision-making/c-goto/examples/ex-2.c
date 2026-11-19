#include <stdio.h>

int main(void)
{
    int valid = 1;
    int status = 0;
    if (!valid) {
        status = 1;
        goto report;
    }
    puts("Accepted");
    report:
    printf("Status=%d\n", status);
    return 0;
}
