#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int main(void)
{
    int position;
    struct Node *head = NULL;
    if (scanf("%d", &position) != 1) {
        puts("invalid");
        return 0;
    }
    for (size_t i = 0; i < 3; ++i) {
        if (!insert_at(&head, i, (int)(i + 1) * 10)) {
            clear_list(&head);
            return EXIT_FAILURE;
        }
    }
    if (position < 0 || !remove_at(&head, (size_t)position)) {
        puts("invalid");
    } else {
        print_list(head);
    }
    clear_list(&head);
    return 0;
}
