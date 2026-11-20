#include <stdio.h>

int main(void)
{
    int mode;
    int value;
    printf("Mode and count: ");
    if (scanf("%d%d", &mode, &value) != 2 || mode < 0 || mode > 1
            || value < 0 || value > 100) {
        puts("invalid");
        return 0;
    }
    FILE *counts = fopen("counts.txt", "w");
    if (counts == NULL) {
        return 1;
    }
    int ok = fputs("10\n", counts) != EOF;
    int closed = fclose(counts) == 0;
    if (!ok || !closed) {
        return 1;
    }
    counts = fopen("counts.txt", mode == 0 ? "w" : "a");
    if (counts == NULL) {
        return 1;
    }
    ok = fprintf(counts, "%d\n", value) >= 0;
    closed = fclose(counts) == 0;
    if (!ok || !closed) {
        return 1;
    }
    counts = fopen("counts.txt", "r");
    if (counts == NULL) {
        return 1;
    }
    int total = 0;
    int next;
    int status;
    while ((status = fscanf(counts, "%d", &next)) == 1) {
        total += next;
    }
    ok = status == EOF && !ferror(counts);
    closed = fclose(counts) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Total: %d\n", total);
    return 0;
}
