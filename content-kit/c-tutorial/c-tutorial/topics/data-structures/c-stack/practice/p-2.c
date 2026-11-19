#include <stdio.h>
#include <string.h>

enum { MAX_BRACKETS = 80 };

static int balanced(const char *text)
{
    char stack[MAX_BRACKETS];
    size_t count = 0;
    for (size_t i = 0; text[i] != '\0'; ++i) {
        char ch = text[i];
        if (ch == '(' || ch == '[' || ch == '{') {
            if (count == MAX_BRACKETS) {
                return 0;
            }
            stack[count++] = ch;
        } else if (ch == ')' || ch == ']' || ch == '}') {
            if (count == 0) {
                return 0;
            }
            char open = stack[--count];
            if (!((open == '(' && ch == ')') || (open == '[' && ch == ']') ||
                  (open == '{' && ch == '}'))) {
                return 0;
            }
        }
    }
    return count == 0;
}

int main(void)
{
    char line[82];
    if (fgets(line, sizeof line, stdin) == NULL) {
        puts("invalid");
        return 0;
    }
    puts(balanced(line) ? "balanced" : "invalid");
    return 0;
}
