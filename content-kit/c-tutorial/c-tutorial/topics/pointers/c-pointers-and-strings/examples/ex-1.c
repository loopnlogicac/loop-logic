#include <stdio.h>

int main(void)
{
    char editable[] = "Lab";
    const char *view = "Lab";
    editable[0] = 'M';
    printf("%s %s\n", editable, view);
    return 0;
}
