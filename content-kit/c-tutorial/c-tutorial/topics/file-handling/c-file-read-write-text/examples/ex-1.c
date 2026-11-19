#include <stdio.h>

int main(void)
{
    FILE *marks = fopen("marks.txt", "w");
    if (marks == NULL) {
        return 1;
    }
    int ok = fprintf(marks, "101 85\n102 72\n") >= 0;
    int closed = fclose(marks) == 0;
    if (!ok || !closed) {
        return 1;
    }
    marks = fopen("marks.txt", "r");
    if (marks == NULL) {
        return 1;
    }
    int roll;
    int mark;
    int converted;
    while ((converted = fscanf(marks, "%d%d", &roll, &mark)) == 2) {
        printf("Roll %d: %d\n", roll, mark);
    }
    ok = converted == EOF && !ferror(marks);
    closed = fclose(marks) == 0;
    return ok && closed ? 0 : 1;
}
