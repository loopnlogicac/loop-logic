#include <stdio.h>


int main(void)
{
    const char *text = "ababa";
    int window = (text[0] - 'a') * 26 + text[1] - 'a';
    for (int start = 0; start < 4; start++) {
        printf("%d: %d\n", start, window % 101);
        if (start + 2 < 5) {
            window = ((window - (text[start] - 'a') * 26) % 101 + 101) % 101;
            window = (window * 26 + text[start + 2] - 'a') % 101;
        }
    }
    return 0;
}
