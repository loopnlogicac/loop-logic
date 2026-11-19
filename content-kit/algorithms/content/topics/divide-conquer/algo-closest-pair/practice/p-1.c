#include <stdio.h>
#include <stdlib.h>

typedef struct { int x, y, id; } Point;
static long long distance2(Point a, Point b)
{
    long long dx = (long long)a.x - b.x, dy = (long long)a.y - b.y;
    return dx * dx + dy * dy;
}
static int by_x(const void *a, const void *b)
{
    const Point *p = a, *q = b;
    if (p->x != q->x) { return (p->x > q->x) - (p->x < q->x); }
    return (p->id > q->id) - (p->id < q->id);
}
static long long closest(Point a[], Point buffer[], int lo, int hi)
{
    if (hi - lo <= 3) {
        long long best = 9000000000000000000LL;
        for (int i = lo; i < hi; i++) {
            for (int j = i + 1; j < hi; j++) {
                long long d = distance2(a[i], a[j]);
                if (d < best) { best = d; }
            }
        }
        for (int i = lo + 1; i < hi; i++) {
            Point key = a[i];
            int j = i;
            while (j > lo && a[j - 1].y > key.y) { a[j] = a[j - 1]; j--; }
            a[j] = key;
        }
        return best;
    }
    int mid = lo + (hi - lo) / 2, split_x = a[mid].x;
    long long left = closest(a, buffer, lo, mid);
    long long right = closest(a, buffer, mid, hi);
    long long best = left < right ? left : right;
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        buffer[k++] = a[i].y <= a[j].y ? a[i++] : a[j++];
    }
    while (i < mid) { buffer[k++] = a[i++]; }
    while (j < hi) { buffer[k++] = a[j++]; }
    for (i = lo; i < hi; i++) { a[i] = buffer[i]; }
    int count = 0;
    for (i = lo; i < hi; i++) {
        long long dx = (long long)a[i].x - split_x;
        if (dx * dx < best) { buffer[count++] = a[i]; }
    }
    for (i = 0; i < count; i++) {
        for (j = i + 1; j < count && j <= i + 7; j++) {
            long long dy = (long long)buffer[j].y - buffer[i].y;
            if (dy * dy >= best) { break; }
            long long d = distance2(buffer[i], buffer[j]);
            if (d < best) { best = d; }
        }
    }
    return best;
}

int main(void)
{
    int n;
    Point a[16], buffer[16];
    puts("Enter n and points:");
    if (scanf("%d", &n) != 1 || n < 2 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d%d", &a[i].x, &a[i].y) != 2 ||
            a[i].x < -99 || a[i].x > 99 || a[i].y < -99 || a[i].y > 99) { return 1; }
        a[i].id = i;
    }
    qsort(a, (size_t)n, sizeof a[0], by_x);
    long long best = closest(a, buffer, 0, n);
    printf("squared distance = %lld\n", best);
    return 0;
}
