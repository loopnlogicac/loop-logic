#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *names[] = {"Toma", "Bela", "Asha"};
    for (size_t i = 0; i < 3; i++) {
        for (size_t j = i + 1; j < 3; j++) {
            if (strcmp(names[i], names[j]) > 0) {
                const char *temp = names[i];
                names[i] = names[j];
                names[j] = temp;
            }
        }
    }
    for (size_t i = 0; i < 3; i++) {
        puts(names[i]);
    }
    return 0;
}
