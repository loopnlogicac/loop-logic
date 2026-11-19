#include <stdio.h>



int main(void)
{
    int inferred[] = {4, 8, 12};
    int partial[4] = {9};
    int selected[4] = {[2] = 7};
    printf("%d %d %d\n", inferred[2], partial[3], selected[2]);
    return 0;
}
