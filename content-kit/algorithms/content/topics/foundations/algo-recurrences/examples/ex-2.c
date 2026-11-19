#include <stdio.h>


int main(void)
{
    int stack[64] = {8};
    int top = 1;
    int calls = 0;
    while (top > 0) {
        int n = stack[--top];
        calls++;
        if (n > 1) {
            stack[top++] = n / 2;
            stack[top++] = n - n / 2;
        }
    }
    printf("calls = %d\n", calls);
    return 0;
}
