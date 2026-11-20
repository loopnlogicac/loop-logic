#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int main(void)
{
    struct Node *head = NULL;
    for (size_t i = 0; i < 3; ++i) {
        if (!insert_at(&head, i, (int)(i + 1) * 10)) {
            clear_list(&head);
            return EXIT_FAILURE;
        }
    }
    (void)remove_at(&head, 1);
    print_list(head);
    (void)remove_at(&head, 0);
    print_list(head);
    (void)remove_at(&head, 0);
    print_list(head);
    printf("Empty removal: %d\n", remove_at(&head, 0));
    clear_list(&head);
    return 0;
}
