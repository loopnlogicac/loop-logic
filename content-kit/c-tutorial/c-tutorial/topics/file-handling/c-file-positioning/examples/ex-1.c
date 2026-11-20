#include <stdio.h>

int main(void)
{
    FILE *list = fopen("list.txt", "r");
    if (list == NULL) {
        return 1;
    }
    char line[32];
    if (fgets(line, sizeof line, list) == NULL) {
        fclose(list);
        return 1;
    }
    long bookmark = ftell(list);
    if (bookmark == -1L || fgets(line, sizeof line, list) == NULL) {
        fclose(list);
        return 1;
    }
    printf("Second: %s", line);
    if (fseek(list, bookmark, SEEK_SET) != 0
            || fgets(line, sizeof line, list) == NULL) {
        fclose(list);
        return 1;
    }
    printf("Again: %s", line);
    return fclose(list) == 0 ? 0 : 1;
}
