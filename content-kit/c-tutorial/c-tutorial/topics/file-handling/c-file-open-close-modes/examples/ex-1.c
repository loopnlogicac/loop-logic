#include <stdio.h>

int main(void)
{
    FILE *note = fopen("note.txt", "w");
    if (note == NULL) {
        return 1;
    }
    int ok = fputs("new note\n", note) != EOF;
    int closed = fclose(note) == 0;
    if (!ok || !closed) {
        return 1;
    }
    note = fopen("note.txt", "r");
    if (note == NULL) {
        return 1;
    }
    char line[32];
    if (fgets(line, sizeof line, note) == NULL) {
        fclose(note);
        return 1;
    }
    printf("Now: %s", line);
    return fclose(note) == 0 ? 0 : 1;
}
