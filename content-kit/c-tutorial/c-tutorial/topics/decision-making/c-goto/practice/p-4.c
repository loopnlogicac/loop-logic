#include <stdio.h>

int main(void)
{
    int fail_stage;
    printf("Input: ");
    if (scanf("%d", &fail_stage) != 1 || fail_stage < 0 || fail_stage > 2) {
        return 1;
    }
    int acquired = 0;
    if (fail_stage == 1) {
        goto cleanup;
    }
    acquired = 1;
    if (fail_stage == 2) {
        goto cleanup;
    }
    acquired = 2;
    puts("Work");
    cleanup:
    printf("Released=%d\n", acquired);
    return 0;
}
