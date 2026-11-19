#include <stdio.h>

#define STRINGIFY(x) #x
#define JOIN(a, b) a ## b

int main(void)
{
    int lab_score = 19;
    printf("%s = %d\n", STRINGIFY(lab_score), JOIN(lab_, score));
    return 0;
}
