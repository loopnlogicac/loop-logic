#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Expr {
    char token;
    struct Expr *left, *right;
} Expr;
void dispose(Expr *r)
{
    if (r != NULL) {
        dispose(r->left);
        dispose(r->right);
        free(r);
    }
}
Expr *parse(const char *text)
{
    Expr *stack[24];
    int top = 0;
    for (int i = 0; text[i] != '\0'; i++) {
        char c = text[i];
        if (c == ' ') {
            continue;
        }
        int digit = c >= '0' && c <= '9';
        if (!digit && c != '+' && c != '-' && c != '*') {
            goto fail;
        }
        if (!digit && top < 2) {
            goto fail;
        }
        Expr *r = malloc(sizeof *r);
        if (r == NULL) {
            goto fail;
        }
        *r = (Expr){c, NULL, NULL};
        if (!digit) {
            r->right = stack[--top];
            r->left = stack[--top];
        }
        stack[top++] = r;
    }
    if (top == 1) {
        return stack[0];
    }
fail:
    while (top > 0) {
        dispose(stack[--top]);
    }
    return NULL;
}

void prefix(const Expr *r)
{
    if (r != NULL) {
        putchar(r->token);
        prefix(r->left);
        prefix(r->right);
    }
}

int main(void)
{
    char text[26];
    puts("Postfix (up to 15 symbols, digits and +-*):");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    text[strcspn(text, "\n")] = '\0';
    if (strlen(text) > 15) {
        puts("invalid");
        return 0;
    }
    Expr *root = parse(text);
    if (root == NULL) {
        puts("invalid");
        return 0;
    }
    printf("prefix:");
    prefix(root);
    puts("");
    dispose(root);
    return 0;
}
