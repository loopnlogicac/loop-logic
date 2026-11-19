#include <stdio.h>

void visit(void)
{
    int automatic = 0;
    static int persistent;
    automatic++;
    persistent++;
    printf("%d %d\n", automatic, persistent);
}

int main(void)
{
    visit();
    visit();
    visit();
    return 0;
}
