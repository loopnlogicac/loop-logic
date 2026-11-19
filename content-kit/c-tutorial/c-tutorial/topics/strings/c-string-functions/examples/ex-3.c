#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[] = "Room-204";
    char *dash = strchr(text, '-');
    char *room = strstr(text, "204");
    if (dash != NULL && room != NULL) {
        printf("%s %s\n", dash, room);
    }
    return 0;
}
