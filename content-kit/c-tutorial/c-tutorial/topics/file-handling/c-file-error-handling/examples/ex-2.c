#include <stdio.h>

int main(void)
{
    FILE *tokens = fopen("tokens.txt", "r");
    if (tokens == NULL) {
        return 1;
    }
    int value;
    int status;
    while ((status = fscanf(tokens, "%d", &value)) == 1) {
        printf("Value: %d\n", value);
    }
    if (ferror(tokens)) {
        fclose(tokens);
        return 1;
    }
    if (status == EOF) {
        puts("Clean end");
    } else {
        puts("Malformed token before EOF");
    }
    return fclose(tokens) == 0 ? 0 : 1;
}
