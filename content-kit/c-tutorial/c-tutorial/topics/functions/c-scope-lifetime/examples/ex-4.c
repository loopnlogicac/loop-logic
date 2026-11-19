#include <stdio.h>



int main(void)
{
    int completed = 0;
    {
        completed = 1;
        goto done;
    }
    done:
    printf("%d\n", completed);
    return 0;
}
