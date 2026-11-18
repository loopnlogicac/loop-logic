#include <stdio.h>

int main(void)
{
    int roll, marks;
    printf("Input: ");
    if (scanf("%d %d", &roll, &marks) != 2) {
        return 1;
    }
    printf("\"roll\"\t%d\n\"marks\"\t%d\n", roll, marks);
    return 0;
}
