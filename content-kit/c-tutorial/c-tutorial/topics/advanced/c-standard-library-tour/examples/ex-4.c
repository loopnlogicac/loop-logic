#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void)
{
    struct tm date = {0};
    date.tm_year = 2026 - 1900;
    date.tm_mon = 11 - 1;
    date.tm_mday = 19;
    char label[11];
    if (strftime(label, sizeof label, "%Y-%m-%d", &date) == 0) {
        return EXIT_FAILURE;
    }
    printf("Date: %s\n", label);
    printf("Distance: %d\n", abs(-12));
    printf("Same instant: %.0f\n", difftime((time_t)0, (time_t)0));
    exit(EXIT_SUCCESS);
}
