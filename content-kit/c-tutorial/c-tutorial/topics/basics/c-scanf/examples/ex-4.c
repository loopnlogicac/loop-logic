#include <stdio.h>

int main(void)
{
    char label[12];
    printf("Input: ");
    if (scanf("%11s", label) != 1) {
        return 1;
    }
    printf("Label=%s\n", label);
    return 0;
}
