#include <stdio.h>

int main(void)
{
    char first;
    printf("Letter: ");
    if (scanf(" %c", &first) != 1 || first < 'A' || first > 'Z') {
        puts("invalid");
        return 0;
    }
    FILE *label = fopen("label.txt", "w");
    if (label == NULL) {
        return 1;
    }
    int ok = fputs("CSE\n", label) != EOF;
    int closed = fclose(label) == 0;
    if (!ok || !closed) {
        return 1;
    }
    label = fopen("label.txt", "r+");
    if (label == NULL) {
        return 1;
    }
    if (fputc(first, label) == EOF || fseek(label, 0L, SEEK_SET) != 0) {
        fclose(label);
        return 1;
    }
    char line[16];
    if (fgets(line, sizeof line, label) == NULL) {
        fclose(label);
        return 1;
    }
    printf("Label: %s", line);
    return fclose(label) == 0 ? 0 : 1;
}
