#include <stdio.h>

struct Flags {
    unsigned int active : 1;
    unsigned int paid : 1;
    unsigned int attempts : 3;
};

int main(void)
{
    unsigned int attempts;
    puts("Attempts:");
    if (scanf("%u", &attempts) != 1 || attempts > 7) {
        return 1;
    }
    struct Flags flags = {.attempts = attempts};
    if (flags.attempts < 7) {
        flags.attempts++;
    }
    printf("%u\n", (unsigned int)flags.attempts);
    return 0;
}
