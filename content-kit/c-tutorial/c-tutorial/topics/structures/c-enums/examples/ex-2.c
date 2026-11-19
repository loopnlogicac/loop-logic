#include <stdio.h>

enum Status { STATUS_NEW = 2, STATUS_RUNNING, STATUS_DONE = 8, STATUS_FAILED };

int main(void)
{
    enum Status status = STATUS_DONE;
    switch (status) {
        case STATUS_NEW: puts("new"); break;
        case STATUS_RUNNING: puts("running"); break;
        case STATUS_DONE: puts("done"); break;
        case STATUS_FAILED: puts("failed"); break;
        default: puts("unknown"); break;
    }
    return 0;
}
