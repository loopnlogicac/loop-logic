#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    struct Flags flags = {.active = 1, .paid = 0, .attempts = 5};
    printf("%u %u %u\n", (unsigned int)flags.active, (unsigned int)flags.paid,
           (unsigned int)flags.attempts);
    return 0;
}
