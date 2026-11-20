#include <stdio.h>

int main(void)
{
    FILE *input = fopen("import.txt", "r");
    if (input == NULL) {
        return 1;
    }
    char line[64];
    int accepted = 0;
    int rejected = 0;
    while (fgets(line, sizeof line, input) != NULL) {
        int roll;
        int mark;
        char extra[2];
        int converted = sscanf(line, "%d%d%1s", &roll, &mark, extra);
        if (converted == 2 && roll >= 100 && roll <= 999
                && mark >= 0 && mark <= 100) {
            accepted++;
        } else {
            rejected++;
        }
    }
    int ok = !ferror(input);
    int closed = fclose(input) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Accepted: %d\nRejected: %d\n", accepted, rejected);
    return 0;
}
