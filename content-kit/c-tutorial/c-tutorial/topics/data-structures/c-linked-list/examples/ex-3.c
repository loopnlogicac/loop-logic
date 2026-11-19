#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int main(void)
{
    struct Node *head = NULL;
    if (!insert_at(&head, 0, 7)) {
        return EXIT_FAILURE;
    }
    printf("Insert beyond end: %d\n", insert_at(&head, 2, 99));
    size_t position = 88;
    printf("Missing search: %d\n", find_value(head, 8, &position));
    printf("Retained output: %zu\n", position);
    print_list(head);
    clear_list(&head);
    printf("Cleared: %d\n", head == NULL);
    return 0;
}
