#include <stdio.h>

int main(void)
{
    int registered = 1;
    int mark = 65;
    if (registered) {
        if (mark >= 40) {
            puts("Eligible");
        } else {
            puts("Low mark");
        }
    } else {
        puts("Unregistered");
    }
    return 0;
}
