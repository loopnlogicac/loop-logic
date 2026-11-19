#include <stdio.h>

struct Record { int key; char id; };

int main(void)
{
    struct Record a[] = {{2, 'A'}, {1, 'B'}, {2, 'C'}, {0, 'D'}};
    struct Record output[4];
    int count[3] = {0};
    for (int i = 0; i < 4; i++) {
        count[a[i].key]++;
    }
    for (int key = 1; key < 3; key++) {
        count[key] += count[key - 1];
    }
    for (int i = 3; i >= 0; i--) {
        output[--count[a[i].key]] = a[i];
    }
    for (int i = 0; i < 4; i++) {
        printf("%d%c%s", output[i].key, output[i].id, i == 3 ? "\n" : " ");
    }
    return 0;
}
