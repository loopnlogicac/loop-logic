#include <stdio.h>

int main(void)
{
    int tag, number;
    char letter;
    puts("Tag, integer and character:");
    if (scanf("%d %d %c", &tag, &number, &letter) != 3 || tag < 0 || tag > 1 ||
        number < -100 || number > 100) {
        return 1;
    }
    void *data = tag == 0 ? (void *)&number : (void *)&letter;
    if (tag == 0) {
        int *p = data;
        printf("%d\n", *p);
    } else {
        char *p = data;
        printf("%c\n", *p);
    }
    return 0;
}
