#include <stdio.h>



int main(void)
{
    int cube[2][3][4] = {0};
    int layer = 1, row = 2, column = 3;
    size_t offset = ((size_t)layer * 3 + row) * 4 + column;
    cube[layer][row][column] = 77;
    printf("offset=%zu value=%d elements=%zu\n", offset,
           cube[layer][row][column], sizeof cube / sizeof cube[0][0][0]);
    return 0;
}
