#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int main(void)
{
    struct Node *head = NULL;
    if (!insert_at(&head, 0, 20) || !insert_at(&head, 0, 10) ||
        !insert_at(&head, 2, 40) || !insert_at(&head, 2, 30)) {
        clear_list(&head);
        return EXIT_FAILURE;
    }
    print_list(head);
    size_t position;
    if (find_value(head, 30, &position)) {
        printf("30 at %zu\n", position);
    }
    clear_list(&head);
    return 0;
}
