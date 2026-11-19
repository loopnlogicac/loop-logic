#include <stdio.h>
extern int lab_capacity;
int main(void)
{
    printf("%d\n", lab_capacity);
    return 0;
}
int lab_capacity = 60;
