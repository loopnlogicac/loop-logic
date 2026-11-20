#include "range.h"

int in_range(int value, int low, int high)
{
    return low <= high && value >= low && value <= high;
}
