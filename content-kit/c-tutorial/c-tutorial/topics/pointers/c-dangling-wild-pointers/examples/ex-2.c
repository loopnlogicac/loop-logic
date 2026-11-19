#include <stdio.h>

int main(void)
{
    int saved;
    {
        int local = 30;
        int *view = &local;
        saved = *view;
    }
    printf("%d\n", saved);
    return 0;
}
