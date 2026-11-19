#include <stdio.h>
#include <string.h>

int main(void)
{
    char names[3][12] = {"Toma", "Bela", "Asha"};
    char temp[12];
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
