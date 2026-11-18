#include <stdio.h>

int main(void)
{
    int marks[] = {72, 85, 64, 91, 58, 77};
    int count = (int)(sizeof marks / sizeof marks[0]);

    /* two loop variables: left moves forward, right moves backward */
    for (int left = 0, right = count - 1; left < right; left++, right--) {
        int temp = marks[left];
        marks[left] = marks[right];
        marks[right] = temp;
    }

    printf("Reversed marks:");
    for (int i = 0; i < count; i++) {
        printf(" %d", marks[i]);
    }
    printf("\n");
    return 0;
}
