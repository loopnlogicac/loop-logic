#include <stdio.h>

int next_visit(void)
{
    static int visits;
    return ++visits;
}

int main(void)
{
    printf("%d\n", next_visit());
    printf("%d\n", next_visit());
    return 0;
}
