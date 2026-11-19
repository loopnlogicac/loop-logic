#include <stdio.h>
#include <string.h>

int main(void)
{
    char names[3][12], temp[12];
    puts("Names:");
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%11s", names[i]) != 1) {
            return 1;
        }
    }
    for (size_t i = 0; i < 3; i++) {
        for (size_t j = i + 1; j < 3; j++) {
            if (strcmp(names[i], names[j]) > 0) {
                strcpy(temp, names[i]);
                strcpy(names[i], names[j]);
                strcpy(names[j], temp);
            }
        }
    }
    for (size_t i = 0; i < 3; i++) {
        puts(names[i]);
    }
    return 0;
}
