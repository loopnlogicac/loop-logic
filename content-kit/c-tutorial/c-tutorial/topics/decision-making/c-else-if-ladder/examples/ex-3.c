#include <stdio.h>

int main(void)
{
    int students = 25;
    if (students <= 20) {
        puts("Small");
    } else if (students <= 40) {
        puts("Medium");
    } else {
        puts("Large");
    }
    return 0;
}
