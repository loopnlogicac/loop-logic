#include <stdio.h>

int main(void)
{
    int value;
    int status;
    int count = 0;
    int sum = 0;
    puts("Tokens:");
    while ((status = fscanf(stdin, "%d", &value)) == 1) {
        count++;
        sum += value;
    }
    if (ferror(stdin)) {
        return 1;
    }
    printf("Count: %d\nSum: %d\nEnd: %s\n", count, sum,
           status == EOF ? "clean" : "invalid");
    return 0;
}
