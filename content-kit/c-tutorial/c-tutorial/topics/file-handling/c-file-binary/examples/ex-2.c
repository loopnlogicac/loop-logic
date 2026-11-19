#include <stdio.h>

typedef struct {
    int roll;
    double mark;
} Record;

int main(void)
{
    const Record original[] = {{101, 85.5}, {102, 72.0}};
    FILE *records = fopen("local.bin", "wb");
    if (records == NULL) {
        return 1;
    }
    int ok = fwrite(original, sizeof original[0], 2, records) == 2;
    int closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    records = fopen("local.bin", "rb");
    if (records == NULL) {
        return 1;
    }
    Record copy[2];
    ok = fread(copy, sizeof copy[0], 2, records) == 2;
    closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    for (int i = 0; i < 2; i++) {
        printf("%d %.1f\n", copy[i].roll, copy[i].mark);
    }
    return 0;
}
