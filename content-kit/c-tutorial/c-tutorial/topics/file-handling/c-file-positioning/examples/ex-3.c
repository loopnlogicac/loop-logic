#include <stdio.h>

int main(void)
{
    FILE *file = tmpfile();
    if (file == NULL) {
        return 1;
    }
    if (fputs("ABC", file) == EOF) {
        fclose(file);
        return 1;
    }
    rewind(file);
    while (fgetc(file) != EOF) {
    }
    if (ferror(file)) {
        fclose(file);
        return 1;
    }
    printf("At end: %d\n", feof(file) != 0);
    rewind(file);
    printf("After rewind: %d\n", feof(file) != 0);
    int ch = fgetc(file);
    if (ch == EOF) {
        fclose(file);
        return 1;
    }
    printf("First: %c\n", ch);
    return fclose(file) == 0 ? 0 : 1;
}
