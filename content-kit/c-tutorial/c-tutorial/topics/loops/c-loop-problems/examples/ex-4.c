#include <stdio.h>

int main(void)
{
    int low = 1;
    int high = 15;
    int found = 0;
    for (int value = low; value <= high; value++) {
        int prime = value >= 2;
        for (int d = 2; prime && d <= value / d; d++) {
            if (value % d == 0) {
                prime = 0;
            }
        }
        if (prime) {
            if (found) {
                printf(" ");
            }
            printf("%d", value);
            found = 1;
        }
    }
    if (!found) {
        printf("None");
    }
    puts("");
    return 0;
}
