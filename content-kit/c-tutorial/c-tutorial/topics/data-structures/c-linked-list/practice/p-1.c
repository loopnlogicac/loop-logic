#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int main(void)
{
    int n;
    struct Node *head = NULL;
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        int value;
        if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
            clear_list(&head);
            puts("invalid");
            return 0;
        }
        if (!insert_at(&head, (size_t)i, value)) {
            clear_list(&head);
            return EXIT_FAILURE;
        }
    }
    print_list(head);
    clear_list(&head);
    return 0;
}
