#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    srand(7U);
    int first = rand();
    int second = rand();
    srand(7U);
    int again_first = rand();
    int again_second = rand();
    printf("Repeated: %d\n", first == again_first && second == again_second);
    printf("Within bounds: %d\n", first >= 0 && first <= RAND_MAX);
    return 0;
}
