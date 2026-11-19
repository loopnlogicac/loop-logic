#include <stdio.h>

int main(void)
{
    int number;

    printf("Which table do you want? ");
    if (scanf("%d", &number) != 1 || number < -1000 || number > 1000) {
        printf("That was not a number.\n");
        return 1;
    }

    for (int i = 1; i <= 10; i++) {
        printf("%2d x %2d = %3d\n", number, i, number * i);
    }
    return 0;
}
