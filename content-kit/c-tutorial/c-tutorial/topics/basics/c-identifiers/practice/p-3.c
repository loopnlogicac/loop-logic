#include <stdio.h>

int main(void)
{
    int theory_marks, lab_marks;
    printf("Input: ");
    if (scanf("%d %d", &theory_marks, &lab_marks) != 2) {
        return 1;
    }
    printf("theory_marks=%d\nlab_marks=%d\n", theory_marks, lab_marks);
    return 0;
}
