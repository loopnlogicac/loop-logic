#include <stdio.h>

int main(void)
{
    int *p = NULL;
    int score = 20;
    p = &score;
    if (p != NULL) {
        printf("%d\n", *p);
    }
    return 0;
}
