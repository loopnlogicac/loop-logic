#include <stdio.h>

void reverse(char text[], int left, int right)
{
    if (left >= right) {
        return;
    }
    char temporary = text[left];
    text[left] = text[right];
    text[right] = temporary;
    reverse(text, left + 1, right - 1);
}

int main(void)
{
    char text[21];
    puts("Word:");
    if (scanf("%20s", text) != 1) {
        return 1;
    }
    int length = 0;
    while (text[length] != '\0') {
        length++;
    }
    reverse(text, 0, length - 1);
    puts(text);
    return 0;
}
