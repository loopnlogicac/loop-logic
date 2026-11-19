#include <stdio.h>

static int days_needed(int capacity)
{
    int jobs[] = {7, 3, 5, 3, 5};
    int days = 1;
    int used = 0;
    for (int i = 0; i < 5; i++) {
        if (jobs[i] > capacity) {
            return 6;
        }
        if (used + jobs[i] > capacity) {
            days++;
            used = 0;
        }
        used += jobs[i];
    }
    return days;
}

int main(void)
{
    int low = 1;
    int high = 23;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (days_needed(mid) <= 3) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }
    printf("capacity = %d\n", low);
    return 0;
}
