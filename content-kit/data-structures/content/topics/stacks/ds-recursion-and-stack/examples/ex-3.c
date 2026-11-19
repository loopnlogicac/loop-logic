#include <stdio.h>


typedef struct {
    int n;
    char from;
    char spare;
    char to;
    int phase;
} Frame;
static void hanoi(int n, char from, char spare, char to)
{
    Frame frames[10] = {{n, from, spare, to, 0}};
    int top = 0;
    while (top >= 0) {
        Frame *frame = &frames[top];
        if (frame->n == 0) {
            top--;
        } else if (frame->phase == 0) {
            frame->phase = 1;
            Frame child = {frame->n - 1, frame->from, frame->to, frame->spare, 0};
            frames[++top] = child;
        } else if (frame->phase == 1) {
            printf("%d: %c -> %c\n", frame->n, frame->from, frame->to);
            frame->phase = 2;
            Frame child = {frame->n - 1, frame->spare, frame->from, frame->to, 0};
            frames[++top] = child;
        } else {
            top--;
        }
    }
}

int main(void)
{
    int n;
    puts("Disks (0..8):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        return 1;
    }
    hanoi(n, 'A', 'B', 'C');
    return 0;
}
