#include <stdio.h>

int main(void)
{
    int valid;
    printf("Input: ");
    if (scanf("%d", &valid) != 1 || valid < 0 || valid > 1) {
        return 1;
    }
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
