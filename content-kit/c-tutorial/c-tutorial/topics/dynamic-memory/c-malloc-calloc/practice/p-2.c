#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Count and groups:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 30) {
        return 1;
    }
    unsigned int *freq = calloc(3, sizeof *freq);
    if (freq == NULL) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        int group;
        if (scanf("%d", &group) != 1 || group < 0 || group > 2) {
            free(freq);
            return 1;
        }
        freq[group]++;
    }
    printf("%u %u %u\n", freq[0], freq[1], freq[2]);
    free(freq);
    return 0;
}
