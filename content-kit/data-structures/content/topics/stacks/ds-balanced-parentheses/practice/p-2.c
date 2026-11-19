#include <stdio.h>
#include <string.h>


static int match(char open, char close)
{
    return (open == '(' && close == ')') || (open == '[' && close == ']')
        || (open == '{' && close == '}');
}
static int check(const char *text)
{
    char items[25];
    int positions[25];
    int top = -1;
    for (int i = 0; text[i] != '\0'; i++) {
        char token = text[i];
        if (token == '(' || token == '[' || token == '{') {
            items[++top] = token;
            positions[top] = i + 1;
        } else if (token == ')' || token == ']' || token == '}') {
            if (top < 0 || !match(items[top], token)) {
                return i + 1;
            }
            top--;
        }
    }
    return top < 0 ? 0 : positions[0];
}

int main(void)
{
    char text[26];
    puts("Expression (at most 24 characters):");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    size_t length = strcspn(text, "\n");
    if (length > 24) {
        return 1;
    }
    text[length] = '\0';
    int error = check(text);
    puts(error == 0 ? "Balanced" : "Unbalanced");
    return 0;
}
