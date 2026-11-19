#include <stdio.h>



int main(void)
{
    int marks[4] = {65, 72, 81, 59};
    marks[1] = 75;
    for (int i = 0; i < 4; i++) {
        printf("%d:%d\n", i, marks[i]);
    }
    return 0;
}
