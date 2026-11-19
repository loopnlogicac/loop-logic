#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    unsigned int active, paid;
    puts("Two flags:");
    if (scanf("%u %u", &active, &paid) != 2 || active > 1 || paid > 1) {
        return 1;
    }
    struct Flags flags = {.active = active, .paid = paid};
    flags.paid = !flags.paid;
    printf("%u %u\n", (unsigned int)flags.active, (unsigned int)flags.paid);
    return 0;
}
