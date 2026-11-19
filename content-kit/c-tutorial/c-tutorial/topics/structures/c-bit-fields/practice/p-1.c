#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    unsigned int active, paid, attempts;
    puts("Active paid attempts:");
    if (scanf("%u %u %u", &active, &paid, &attempts) != 3
        || active > 1 || paid > 1 || attempts > 7) {
        return 1;
    }
    struct Flags flags = {active, paid, attempts};
    printf("%u %u %u\n", (unsigned int)flags.active, (unsigned int)flags.paid,
           (unsigned int)flags.attempts);
    return 0;
}
