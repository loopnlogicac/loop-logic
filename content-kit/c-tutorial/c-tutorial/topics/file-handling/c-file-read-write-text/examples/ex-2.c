#include <stdio.h>

int main(void)
{
    FILE *message = fopen("message.txt", "r");
    if (message == NULL) {
        return 1;
    }
    char line[64];
    int ok = 1;
    while (fgets(line, sizeof line, message) != NULL) {
        if (fputs(line, stdout) == EOF) {
            ok = 0;
            break;
        }
    }
    ok = ok && !ferror(message);
    int closed = fclose(message) == 0;
    return ok && closed ? 0 : 1;
}
