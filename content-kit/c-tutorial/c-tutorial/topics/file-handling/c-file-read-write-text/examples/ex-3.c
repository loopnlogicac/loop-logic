#include <stdio.h>

int main(void)
{
    FILE *source = fopen("message.txt", "r");
    if (source == NULL) {
        return 1;
    }
    FILE *copy = fopen("copy.txt", "w");
    if (copy == NULL) {
        fclose(source);
        return 1;
    }
    int ch;
    int count = 0;
    int ok = 1;
    while ((ch = fgetc(source)) != EOF) {
        if (fputc(ch, copy) == EOF) {
            ok = 0;
            break;
        }
        count++;
    }
    ok = ok && !ferror(source);
    int source_closed = fclose(source) == 0;
    int copy_closed = fclose(copy) == 0;
    if (!ok || !source_closed || !copy_closed) {
        return 1;
    }
    printf("Copied characters: %d\n", count);
    return 0;
}
