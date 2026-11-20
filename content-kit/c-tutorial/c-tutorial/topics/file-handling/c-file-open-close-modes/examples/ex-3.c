#include <stdio.h>

int main(void)
{
    FILE *code = fopen("code.txt", "r+");
    if (code == NULL) {
        return 1;
    }
    int before = fgetc(code);
    if (before == EOF || fseek(code, 0L, SEEK_SET) != 0) {
        fclose(code);
        return 1;
    }
    if (fputc('X', code) == EOF || fseek(code, 0L, SEEK_SET) != 0) {
        fclose(code);
        return 1;
    }
    char line[16];
    if (fgets(line, sizeof line, code) == NULL) {
        fclose(code);
        return 1;
    }
    printf("Before: %c\nAfter: %s", before, line);
    return fclose(code) == 0 ? 0 : 1;
}
