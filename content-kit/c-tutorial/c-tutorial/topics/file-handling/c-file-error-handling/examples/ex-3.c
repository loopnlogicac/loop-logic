#include <stdio.h>

int main(void)
{
    FILE *file = tmpfile();
    if (file == NULL) {
        return 1;
    }
    if (fputc('A', file) == EOF) {
        fclose(file);
        return 1;
    }
    rewind(file);
    if (fgetc(file) == EOF || fgetc(file) != EOF || ferror(file)) {
        fclose(file);
        return 1;
    }
    printf("Before clear: %d\n", feof(file) != 0);
    clearerr(file);
    printf("After clear: %d\n", feof(file) != 0);
    int next = fgetc(file);
    printf("Still at end: %d\n", next == EOF && feof(file) != 0);
    return fclose(file) == 0 ? 0 : 1;
}
