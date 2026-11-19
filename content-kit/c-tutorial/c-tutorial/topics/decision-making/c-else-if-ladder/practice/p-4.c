#include <stdio.h>

int main(void)
{
    int mark;
    printf("Input: ");
    if (scanf("%d", &mark) != 1 || mark < 0 || mark > 100) {
        return 1;
    }
    if (mark >= 80) {
        puts("A+");
    } else if (mark >= 75) {
        puts("A");
    } else if (mark >= 70) {
        puts("A-");
    } else if (mark >= 65) {
        puts("B+");
    } else if (mark >= 60) {
        puts("B");
    } else if (mark >= 55) {
        puts("B-");
    } else if (mark >= 50) {
        puts("C+");
    } else if (mark >= 45) {
        puts("C");
    } else if (mark >= 40) {
        puts("D");
    } else {
        puts("F");
    }
    return 0;
}
