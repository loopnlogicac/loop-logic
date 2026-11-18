#include <stdio.h>

int main(void)
{
    unsigned int roll;
    double cgpa;
    char room[8];
    printf("Input: ");
    if (scanf("%u %lf %7s", &roll, &cgpa, room) != 3) {
        return 1;
    }
    printf("%03u %.2f %s\n", roll, cgpa, room);
    return 0;
}
