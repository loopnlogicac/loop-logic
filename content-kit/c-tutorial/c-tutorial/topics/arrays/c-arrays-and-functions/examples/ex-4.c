#include <stdio.h>

void prefix_sums(const int input[], int output[], int count)
{
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += input[i];
        output[i] = sum;
    }
}

int main(void)
{
    int input[] = {3, 5, 2, 4};
    int output[4];
    prefix_sums(input, output, 4);
    for (int i = 0; i < 4; i++) {
        printf("%s%d", i == 0 ? "" : " ", output[i]);
    }
    putchar('\n');
    return 0;
}
