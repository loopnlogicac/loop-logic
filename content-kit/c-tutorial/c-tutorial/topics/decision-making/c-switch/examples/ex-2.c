#include <stdio.h>

int main(void)
{
    int day = 6;
    switch (day) {
        case 6:
        case 7:
            puts("Weekend plan");
            break;
        default:
            puts("Class plan");
            break;
    }
    return 0;
}
