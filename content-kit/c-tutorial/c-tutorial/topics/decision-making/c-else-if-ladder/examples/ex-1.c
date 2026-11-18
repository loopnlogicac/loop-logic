#include <stdio.h>

int main(void)
{
    int marks = 77;
    if (marks >= 80) {
        puts("A+");
    } else if (marks >= 75) {
        puts("A");
    } else {
        puts("Lower band");
    }
    return 0;
}
