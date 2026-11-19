#include <stdio.h>

int main(void)
{
    FILE *visits = fopen("visits.txt", "a+");
    if (visits == NULL) {
        return 1;
    }
    if (fputs("visit\n", visits) == EOF || fseek(visits, 0L, SEEK_SET) != 0) {
        fclose(visits);
        return 1;
    }
    char line[16];
    if (fgets(line, sizeof line, visits) == NULL) {
        fclose(visits);
        return 1;
    }
    printf("First entry: %s", line);
    return fclose(visits) == 0 ? 0 : 1;
}
