#include <stdio.h>

enum Status { STATUS_NEW = 2, STATUS_RUNNING, STATUS_DONE = 8, STATUS_FAILED };

int main(void)
{
    printf("%d %d %d %d\n", STATUS_NEW, STATUS_RUNNING, STATUS_DONE, STATUS_FAILED);
    return 0;
}
