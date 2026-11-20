#include <stdio.h>

int main(void)
{
    int n;
    printf("Rows: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        puts("invalid");
        return 0;
    }
    FILE *journal = fopen("journal.txt", "w");
    if (journal == NULL) {
        return 1;
    }
    int ok = 1;
    for (int i = 0; i < n; i++) {
        if (fputs("present\n", journal) == EOF) {
            ok = 0;
            break;
        }
    }
    int closed = fclose(journal) == 0;
    if (!ok || !closed) {
        return 1;
    }
    journal = fopen("journal.txt", "r");
    if (journal == NULL) {
        return 1;
    }
    int count = 0;
    int ch;
    while ((ch = fgetc(journal)) != EOF) {
        count += ch == '\n';
    }
    ok = !ferror(journal);
    closed = fclose(journal) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Records: %d\n", count);
    return 0;
}
