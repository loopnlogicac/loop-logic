#include <stdio.h>

int main(void)
{
    char first[11];
    char second[11];
    printf("Two words: ");
    if (scanf("%10s%10s", first, second) != 2) {
        puts("invalid");
        return 0;
    }
    FILE *file = fopen("replay.txt", "w");
    if (file == NULL) {
        return 1;
    }
    int ok = fprintf(file, "%s\n%s\n", first, second) >= 0;
    int closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    file = fopen("replay.txt", "r");
    if (file == NULL) {
        return 1;
    }
    long bookmark = ftell(file);
    char word[11];
    if (bookmark == -1L || fscanf(file, "%10s", word) != 1) {
        fclose(file);
        return 1;
    }
    printf("First: %s\n", word);
    if (fseek(file, bookmark, SEEK_SET) != 0 || fscanf(file, "%10s", word) != 1) {
        fclose(file);
        return 1;
    }
    printf("Replayed: %s\n", word);
    return fclose(file) == 0 ? 0 : 1;
}
