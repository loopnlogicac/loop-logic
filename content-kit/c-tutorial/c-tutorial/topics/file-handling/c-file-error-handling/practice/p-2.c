#include <stdio.h>
#include <string.h>

int main(void)
{
    char line[16];
    int accepted = 0;
    int rejected = 0;
    puts("Lines:");
    while (fgets(line, sizeof line, stdin) != NULL) {
        if (strchr(line, '\n') != NULL) {
            accepted++;
            continue;
        }
        int next = fgetc(stdin);
        if (next == '\n' || next == EOF) {
            if (ferror(stdin)) {
                return 1;
            }
            accepted++;
            continue;
        }
        rejected++;
        while ((next = fgetc(stdin)) != EOF && next != '\n') {
        }
        if (ferror(stdin)) {
            return 1;
        }
    }
    if (ferror(stdin)) {
        return 1;
    }
    printf("Accepted: %d\nRejected: %d\n", accepted, rejected);
    return 0;
}
