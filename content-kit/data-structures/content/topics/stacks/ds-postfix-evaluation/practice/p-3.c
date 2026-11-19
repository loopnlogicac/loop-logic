#include <stdio.h>
#include <stdlib.h>
#include <errno.h>


static int apply(char op, int left, int right, int *result)
{
    long value;
    if (op == '+') {
        value = (long)left + right;
    } else if (op == '-') {
        value = (long)left - right;
    } else if (op == '*') {
        value = (long)left * right;
    } else if (op == '/' && right != 0) {
        value = left / right;
    } else {
        return 0;
    }
    if (value < -10000 || value > 10000) {
        return 0;
    }
    printf("Reduce: %d %c %d = %ld\n", left, op, right, value);
    *result = (int)value;
    return 1;
}
static int evaluate(char tokens[][16], int n, int prefix, int *result)
{
    int items[12];
    int top = -1;
    for (int step = 0; step < n; step++) {
        int i = prefix ? n - 1 - step : step;
        char *end;
        errno = 0;
        long value = strtol(tokens[i], &end, 10);
        if (*end == '\0' && end != tokens[i]) {
            if (errno == ERANGE || value < -99 || value > 99) {
                return 0;
            }
            items[++top] = (int)value;
        } else {
            if (tokens[i][1] != '\0' || top < 1) {
                return 0;
            }
            int first = items[top--];
            int second = items[top--];
            int left = prefix ? first : second;
            int right = prefix ? second : first;
            int answer;
            if (!apply(tokens[i][0], left, right, &answer)) {
                return 0;
            }
            items[++top] = answer;
        }
    }
    if (top != 0) {
        return 0;
    }
    *result = items[top];
    return 1;
}

int main(void)
{
    char tokens[12][16];
    int n;
    puts("Token count (1..12), then space-separated tokens:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 12) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%15s", tokens[i]) != 1) {
            return 1;
        }
    }
    int result;
    if (evaluate(tokens, n, 0, &result)) {
        printf("Result: %d\n", result);
    } else {
        puts("Invalid");
    }
    return 0;
}
