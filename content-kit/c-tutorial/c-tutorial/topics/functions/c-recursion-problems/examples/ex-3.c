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
    char text[] = "Dhaka";
    reverse(text, 0, 4);
    puts(text);
    return 0;
}
