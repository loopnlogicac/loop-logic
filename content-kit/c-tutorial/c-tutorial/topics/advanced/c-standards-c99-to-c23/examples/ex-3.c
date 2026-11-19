#include <stdio.h>

int main(void)
{
    bool ready = true;
    typeof(ready) blocked = false;
    int *missing = nullptr;
    unsigned int mask = 0b1010;
    int budget = 1'000;
    printf("Ready: %d\n", ready && !blocked);
    printf("Missing: %d\n", missing == nullptr);
    printf("Mask: %u; budget: %d\n", mask, budget);
    return 0;
}
