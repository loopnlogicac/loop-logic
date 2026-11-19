#include <stdio.h>

int main(void)
{
    int values[] = {2, 4, 6};
    int *found = NULL;
    for (size_t i = 0; i < 3; i++) {
        if (values[i] == 5) {
            found = values + i;
            break;
        }
    }
    puts(found == NULL ? "Missing" : "Found");
    return 0;
}
