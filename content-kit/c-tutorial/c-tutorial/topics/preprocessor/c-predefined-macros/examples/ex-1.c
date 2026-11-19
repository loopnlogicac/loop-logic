#include <stdio.h>

int main(void)
{
    printf("C17 or later: %d\n", __STDC_VERSION__ >= 201710L);
    printf("Conforming indicator: %d\n", __STDC__);
    return 0;
}
