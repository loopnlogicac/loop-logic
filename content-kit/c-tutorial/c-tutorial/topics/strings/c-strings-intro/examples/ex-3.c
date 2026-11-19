#include <stdio.h>

int main(void)
{
    char word[] = "marks";
    word[2] = '\0';
    puts(word);
    printf("suffix still stored: %c\n", word[3]);
    return 0;
}
