#include <stdio.h>

struct Record { int key; char id; };

int main(void)
{
    struct Record left[] = {{1, 'A'}, {3, 'B'}};
    struct Record right[] = {{1, 'C'}, {3, 'D'}};
    struct Record output[4];
    int i = 0;
    int j = 0;
    int k = 0;
    while (i < 2 && j < 2) {
        output[k++] = left[i].key <= right[j].key ? left[i++] : right[j++];
    }
    while (i < 2) {
        output[k++] = left[i++];
    }
    while (j < 2) {
        output[k++] = right[j++];
    }
    for (k = 0; k < 4; k++) {
        printf("%d%c%s", output[k].key, output[k].id, k == 3 ? "\n" : " ");
    }
    return 0;
}
