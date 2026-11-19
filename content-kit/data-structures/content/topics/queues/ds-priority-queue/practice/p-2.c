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
    int count;
    puts("Job count, then id and priority pairs:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 16) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        items[i].arrival = i;
        if (scanf("%d%d", &items[i].id, &items[i].priority) != 2) {
            return 1;
        }
    }
    while (count > 0) {
        int best = 0;
        for (int i = 1; i < count; i++) {
            if (better(items[i], items[best])) {
                best = i;
            }
        }
        Job job = items[best];
        items[best] = items[--count];
        printf("Job: %d Priority: %d\n", job.id, job.priority);
    }
    return 0;
}
