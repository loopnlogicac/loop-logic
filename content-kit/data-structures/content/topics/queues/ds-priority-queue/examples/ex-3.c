#include <stdio.h>


typedef struct {
    int id;
    int priority;
    int arrival;
} Job;
static int better(Job a, Job b)
{
    return a.priority < b.priority || (a.priority == b.priority && a.arrival < b.arrival);
}


int main(void)
{
    Job items[16];
    int n;
    int count = 0;
    puts("Job count, then id and priority pairs:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) {
        return 1;
    }
    for (int arrival = 0; arrival < n; arrival++) {
        Job job = {.arrival = arrival};
        if (scanf("%d%d", &job.id, &job.priority) != 2) {
            return 1;
        }
        int i = count++;
        while (i > 0 && better(job, items[(i - 1) / 2])) {
            items[i] = items[(i - 1) / 2];
            i = (i - 1) / 2;
        }
        items[i] = job;
    }
    while (count > 0) {
        Job job = items[0];
        Job last = items[--count];
        int i = 0;
        while (2 * i + 1 < count) {
            int child = 2 * i + 1;
            if (child + 1 < count && better(items[child + 1], items[child])) {
                child++;
            }
            if (!better(items[child], last)) {
                break;
            }
            items[i] = items[child];
            i = child;
        }
        if (count > 0) {
            items[i] = last;
        }
        printf("Job: %d Priority: %d\n", job.id, job.priority);
    }
    return 0;
}
