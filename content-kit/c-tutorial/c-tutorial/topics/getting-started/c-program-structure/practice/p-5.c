#include <stdio.h>

/* One report has two marks, each out of 100. */
const int maximum = 200;

int add_marks(int theory, int lab)
{
    return theory + lab;
}

int main(void)
{
    int theory, lab;
    printf("Input: ");
    if (scanf("%d %d", &theory, &lab) != 2) {
        return 1;
    }
    int total = add_marks(theory, lab);
    printf("Total=%d\nRemaining=%d\n", total, maximum - total);
    return 0;
}
