#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    struct Flags first = {1, 0, 3};
    struct Flags second = first;
    second.paid = 1;
    printf("%u %u %u\n", (unsigned int)first.paid, (unsigned int)second.paid,
           (unsigned int)second.attempts);
    return 0;
}
