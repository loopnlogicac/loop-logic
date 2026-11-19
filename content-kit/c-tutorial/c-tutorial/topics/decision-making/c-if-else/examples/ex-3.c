#include <stdio.h>

int main(void)
{
    int registered = 1;
    int mark = 35;
    if (registered) {
        if (mark >= 40) {
            puts("Certificate");
        } else {
            puts("Practice first");
        }
    } else {
        puts("Register first");
    }
    return 0;
}
