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
static void insert(Job *items, int *count, Job job)
{
    int i = *count;
    while (i > 0 && better(items[i - 1], job)) {
        items[i] = items[i - 1];
        i--;
    }
    items[i] = job;
    (*count)++;
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
    for (int i = 0; i < n; i++) {
        Job job = {.arrival = i};
        if (scanf("%d%d", &job.id, &job.priority) != 2) {
            return 1;
        }
        insert(items, &count, job);
    }
    while (count > 0) {
        Job job = items[--count];
        printf("Job: %d Priority: %d\n", job.id, job.priority);
    }
    return 0;
}
