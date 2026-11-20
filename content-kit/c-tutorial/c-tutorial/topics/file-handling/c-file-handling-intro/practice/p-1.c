#include <stdio.h>

int main(void)
{
    int fee;
    int total = 0;
    int count = 0;
    int status;
    printf("Fees: ");
    while ((status = scanf("%d", &fee)) == 1) {
        if (fee < 0 || fee > 1000 || count == 20) {
            puts("invalid");
            return 0;
        }
        total += fee;
        count++;
    }
    if (status != EOF || ferror(stdin)) {
        puts("invalid");
    } else {
        printf("%d\n", total);
    }
    return 0;
}
