#include <stdio.h>
#include <string.h>

int main(void)
{
    char room[] = "Lab-204";
    char *suffix = strchr(room, '-');
    if (suffix != NULL) {
        suffix++;
        suffix[0] = '3';
        printf("%s %s\n", room, suffix);
    }
    return 0;
}
