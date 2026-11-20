#include <stdio.h>

int main(void)
{
    FILE *club = fopen("club.txt", "r");
    if (club == NULL) {
        return 1;
    }
    int ch;
    int lines = 0;
    while ((ch = fgetc(club)) != EOF) {
        if (ch == '\n') {
            lines++;
        }
    }
    int failed = ferror(club);
    int closed = fclose(club) == 0;
    if (failed || !closed) {
        return 1;
    }
    printf("Completed lines: %d\n", lines);
    return 0;
}
