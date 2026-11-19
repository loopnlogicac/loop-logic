#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Leaf {
    int key[3], count, next;
} Leaf;
int main(void)
{
    Leaf leaves[] = {{{5, 6, 7}, 3, 1}, {{10, 12, 17}, 3, 2}, {{20, 30, 0}, 2, -1}};
    int low = 7, high = 20;
    int leaf = low < 10 ? 0 : (low < 20 ? 1 : 2);
    printf("range:");
    while (leaf != -1) {
        for (int i = 0; i < leaves[leaf].count; i++) {
            int key = leaves[leaf].key[i];
            if (key > high) {
                puts("");
                return 0;
            }
            if (key >= low) {
                printf(" %d", key);
            }
        }
        leaf = leaves[leaf].next;
    }
    puts("");
    return 0;
}
