#include <stdio.h>

int main(void)
{
    int input, saved;
    puts("Local value:");
    if (scanf("%d", &input) != 1 || input < -100 || input > 100) {
        return 1;
    }
    {
        int local = input;
        int *view = &local;
        saved = *view;
    }
    printf("%d\n", saved);
    return 0;
}
