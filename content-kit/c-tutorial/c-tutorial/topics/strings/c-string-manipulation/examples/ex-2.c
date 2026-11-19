#include <stdio.h>

int main(void)
{
    char left[16] = "Lab";
    const char right[] = "204";
    size_t used = 0, i = 0;
    while (left[used] != '\0') {
        used++;
    }
    while (right[i] != '\0' && used + 1 < sizeof left) {
        left[used++] = right[i++];
    }
    left[used] = '\0';
    const char wanted[] = "Lab204";
    i = 0;
    while (left[i] != '\0' && left[i] == wanted[i]) {
        i++;
    }
    int order = (unsigned char)left[i] - (unsigned char)wanted[i];
    printf("%s equal=%d\n", left, order == 0);
    return 0;
}
