#include <stdio.h>
int seats = 40;
void show_capacity(void)
{
    printf("capacity: %d\n", seats);
}
int main(void)
{
    int seats = 12;
    printf("occupied: %d\n", seats);
    show_capacity();
    return 0;
}
