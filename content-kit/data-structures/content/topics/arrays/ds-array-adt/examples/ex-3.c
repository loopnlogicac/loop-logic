#include <stdio.h>

int main(void)
{
    int values[4] = {10, 20, 30, 40};
    size_t offset = (size_t)2 * sizeof values[0];
    printf("Element: %d\n", *(values + 2));
    printf("Offset agrees: %d\n", offset == 2 * sizeof(int));
    return 0;
}
