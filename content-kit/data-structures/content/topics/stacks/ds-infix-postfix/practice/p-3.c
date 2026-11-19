#include <stdio.h>
#include <string.h>


static int precedence(char token)
{
    if (token == '+' || token == '-') {
        return 1;
    }
    if (token == '*' || token == '/') {
        return 2;
    }
    return token == '^' ? 3 : 0;
}
static int convert(const char *text, char *output)
{
    char items[25];
    int top = -1;
    int used = 0;
    int need_operand = 1;
    for (int i = 0; text[i] != '\0'; i++) {
        char token = text[i];
        if (token == ' ') {
            continue;
        }
        if (token >= 'A' && token <= 'Z') {
            if (!need_operand) {
                return 0;
            }
            output[used++] = token;
            need_operand = 0;
        } else if (token == '(' && need_operand) {
            items[++top] = token;
        } else if (token == ')' && !need_operand) {
            while (top >= 0 && items[top] != '(') {
                output[used++] = items[top--];
            }
            if (top < 0) {
                return 0;
            }
            top--;
        } else if (precedence(token) > 0 && !need_operand) {
            while (top >= 0 && items[top] != '('
                   && (precedence(items[top]) > precedence(token)
                       || (precedence(items[top]) == precedence(token) && token != '^'))) {
                output[used++] = items[top--];
            }
            items[++top] = token;
            need_operand = 1;
        } else {
            return 0;
        }
    }
    if (need_operand) {
        return 0;
    }
    while (top >= 0) {
        if (items[top] == '(') {
            return 0;
        }
        output[used++] = items[top--];
    }
    output[used] = '\0';
    return 1;
}

int main(void)
{
    char text[26];
    char output[25];
    puts("Infix (A..Z, binary + - * / ^, at most 24 characters):");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    size_t length = strcspn(text, "\n");
    if (length > 24) {
        return 1;
    }
    text[length] = '\0';
    if (!convert(text, output)) {
        puts("Invalid");
    } else {
        int operators = 0;
        for (int i = 0; output[i] != '\0'; i++) {
            operators += precedence(output[i]) > 0;
        }
        printf("Operators: %d\n", operators);
    }
    return 0;
}
