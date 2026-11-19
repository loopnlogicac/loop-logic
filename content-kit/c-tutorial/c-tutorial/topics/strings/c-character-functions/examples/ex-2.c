#include <stdio.h>
#include <ctype.h>

int main(void)
{
    printf("tab=%d upper=%d digit=%d\n",
           isspace((unsigned char)'\t') != 0,
           isupper((unsigned char)'A') != 0,
           isdigit((unsigned char)'A') != 0);
    return 0;
}
