#include <stdio.h>



int main(void)
{
    int readings[2][2][3] = {
        {{21, 22, 23}, {24, 25, 26}},
        {{31, 32, 33}, {34, 35, 36}}
    };
    for (int day = 0; day < 2; day++) {
        int total = 0;
        for (int room = 0; room < 2; room++) {
            for (int hour = 0; hour < 3; hour++) {
                total += readings[day][room][hour];
            }
        }
        printf("day %d: %d\n", day, total);
    }
    return 0;
}
