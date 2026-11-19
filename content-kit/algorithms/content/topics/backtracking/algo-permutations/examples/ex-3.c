#include <stdio.h>


int main(void)
{
    const char *word = "aabb";
    unsigned counts[26] = {0}, total = 24;
    for (int i = 0; word[i]; i++) {
        counts[word[i] - 'a']++;
    }
    for (int c = 0; c < 26; c++) {
        for (unsigned k = 2; k <= counts[c]; k++) {
            total /= k;
        }
    }
    printf("Distinct arrangements of aabb: %u\n", total);
    return 0;
}
