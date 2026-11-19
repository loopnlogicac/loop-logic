#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    unsigned int active, paid, attempts;
    puts("Flag values:");
    if (scanf("%u %u %u", &active, &paid, &attempts) != 3
        || active > 1 || paid > 1 || attempts > 7) {
        return 1;
    }
    struct Flags flags = {active, paid, attempts};
    unsigned int word = (unsigned int)flags.active | ((unsigned int)flags.paid << 1)
        | ((unsigned int)flags.attempts << 2);
    printf("%u %u %u %u\n", word, word & 1U, (word >> 1) & 1U, (word >> 2) & 7U);
    return 0;
}
