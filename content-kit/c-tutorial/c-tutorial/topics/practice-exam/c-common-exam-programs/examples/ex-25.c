#include <stdio.h>

int main(void)
{
    FILE *file = tmpfile();
    if (file == NULL) {
        return 1;
    }
    if (fputs("101 72\n102 90\n", file) == EOF || fseek(file, 0L, SEEK_SET) != 0) {
        (void)fclose(file);
        return 1;
    }
    int roll;
    int score;
    int count = 0;
    while (fscanf(file, "%d%d", &roll, &score) == 2) {
        printf("%d:%d\n", roll, score);
        ++count;
    }
    int failed = ferror(file);
    if (fclose(file) == EOF || failed) {
        return 1;
    }
    printf("Records: %d\n", count);
    return 0;
}
