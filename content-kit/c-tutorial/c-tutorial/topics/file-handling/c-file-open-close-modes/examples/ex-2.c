#include <stdio.h>

int main(void)
{
    FILE *log = fopen("log.txt", "a");
    if (log == NULL) {
        return 1;
    }
    if (fseek(log, 0L, SEEK_SET) != 0) {
        fclose(log);
        return 1;
    }
    int ok = fputs("34\n", log) != EOF;
    int closed = fclose(log) == 0;
    if (!ok || !closed) {
        return 1;
    }
    log = fopen("log.txt", "r");
    if (log == NULL) {
        return 1;
    }
    puts("Log:");
    int ch;
    while ((ch = fgetc(log)) != EOF) {
        if (putchar(ch) == EOF) {
            fclose(log);
            return 1;
        }
    }
    ok = !ferror(log);
    closed = fclose(log) == 0;
    return ok && closed ? 0 : 1;
}
