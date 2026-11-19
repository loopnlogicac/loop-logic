#include <stdio.h>

int main(void)
{
    char line[64];
    int valid = 0;
    int invalid = 0;
    puts("Records:");
    while (fgets(line, sizeof line, stdin) != NULL) {
        int roll;
        int mark;
        char extra[2];
        int n = sscanf(line, "%d%d%1s", &roll, &mark, extra);
        if (n == 2 && roll >= 100 && roll <= 999 && mark >= 0 && mark <= 100) {
            valid++;
        } else {
            invalid++;
        }
    }
    if (ferror(stdin)) {
        return 1;
    }
    printf("Valid: %d\nInvalid: %d\n", valid, invalid);
    return 0;
}
