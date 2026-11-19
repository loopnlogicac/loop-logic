#include <stdio.h>
#include <string.h>

int main(void)
{
    char label[16];
    strcpy(label, "CSE");
    strcat(label, " 212");
    printf("%s: %zu\n", label, strlen(label));
    return 0;
}
