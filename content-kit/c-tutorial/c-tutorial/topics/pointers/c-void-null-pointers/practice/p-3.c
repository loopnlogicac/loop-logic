#include <stdio.h>

int main(void)
{
    int a[] = {4, 7, 4}, key;
    puts("Search key:");
    if (scanf("%d", &key) != 1 || key < -100 || key > 100) {
        return 1;
    }
    int *found = NULL;
    for (size_t i = 0; i < 3; i++) {
        if (a[i] == key) {
            found = a + i;
            break;
        }
    }
    if (found == NULL) {
        puts("MISSING");
    } else {
        printf("%td\n", found - a);
    }
    return 0;
}
