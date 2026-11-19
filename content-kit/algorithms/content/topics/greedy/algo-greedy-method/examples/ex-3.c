#include <stdio.h>



int main(void)
{
    int before[] = {8, 2, 5}, after[] = {2, 5, 8};
    int elapsed = 0, total_before = 0, total_after = 0;
    for (int i = 0; i < 3; i++) { elapsed += before[i]; total_before += elapsed; }
    elapsed = 0;
    for (int i = 0; i < 3; i++) { elapsed += after[i]; total_after += elapsed; }
    printf("completion totals = %d %d\n", total_before, total_after);
    return 0;
}
