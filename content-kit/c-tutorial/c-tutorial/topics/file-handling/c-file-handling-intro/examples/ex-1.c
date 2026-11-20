#include <stdio.h>

int main(void)
{
    FILE *fees = fopen("fees.txt", "w");
    if (fees == NULL) {
        return 1;
    }
    int written = fputs("125\n", fees) != EOF;
    int closed = fclose(fees) == 0;
    if (!written || !closed) {
        return 1;
    }
    fees = fopen("fees.txt", "r");
    if (fees == NULL) {
        return 1;
    }
    char line[32];
    if (fgets(line, sizeof line, fees) == NULL) {
        fclose(fees);
        return 1;
    }
    printf("Stored fee: %s", line);
    return fclose(fees) == 0 ? 0 : 1;
}
