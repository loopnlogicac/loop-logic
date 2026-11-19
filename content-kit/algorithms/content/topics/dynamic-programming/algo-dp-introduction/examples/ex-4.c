#include <stdio.h>



int main(void)
{
    int previous = 0, current = 1;
    for (int i = 0; i < 7; i++) {
        int next = previous + current;
        previous = current; current = next;
    }
    printf("F(7) = %d\n", previous);
    return 0;
}
