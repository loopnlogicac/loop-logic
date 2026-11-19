#include <stdio.h>


int main(void)
{
    const char *words[] = {"aa", "dx"};
    for (int i = 0; i < 2; i++) {
        int hash = 0;
        for (int j = 0; words[i][j]; j++) {
            hash = (hash * 26 + words[i][j] - 'a') % 101;
        }
        printf("%s: %d\n", words[i], hash);
    }
    puts("Equal hashes still need character checks.");
    return 0;
}
