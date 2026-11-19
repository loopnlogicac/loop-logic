#include <stdio.h>
#include <string.h>

int main(void)
{
    char line[8];
    puts("Line of at most 6 characters:");
    if (fgets(line, sizeof line, stdin) == NULL) {
        return 1;
    }
    char *newline = strchr(line, '\n');
    if (newline == NULL && strlen(line) > 6) {
        int ch;
        while ((ch = getchar()) != '\n' && ch != EOF) {
        }
        puts("Too long");
    } else {
        line[strcspn(line, "\n")] = '\0';
        printf("Accepted: %s\n", line);
    }
    return 0;
}
