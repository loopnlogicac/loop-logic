#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    struct Flags flags = {0};
    flags.active = 1;
    flags.paid = 1;
    flags.attempts = 7;
    if (flags.attempts < 7) {
        flags.attempts++;
    }
    printf("%u %u\n", (unsigned int)flags.paid, (unsigned int)flags.attempts);
    return 0;
}
