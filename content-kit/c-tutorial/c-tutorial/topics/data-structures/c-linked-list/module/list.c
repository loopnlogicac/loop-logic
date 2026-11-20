#include <stdio.h>
#include <stdlib.h>
#include "list.h"

int insert_at(struct Node **head, size_t position, int value)
{
    struct Node **link = head;
    for (size_t i = 0; i < position; ++i) {
        if (*link == NULL) {
            return 0;
        }
        link = &(*link)->next;
    }
    struct Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return 0;
    }
    node->value = value;
    node->next = *link;
    *link = node;
    return 1;
}

int remove_at(struct Node **head, size_t position)
{
    struct Node **link = head;
    for (size_t i = 0; i < position; ++i) {
        if (*link == NULL) {
            return 0;
        }
        link = &(*link)->next;
    }
    if (*link == NULL) {
        return 0;
    }
    struct Node *removed = *link;
    *link = removed->next;
    free(removed);
    return 1;
}

int find_value(const struct Node *head, int value, size_t *position)
{
    size_t index = 0;
    for (const struct Node *node = head; node != NULL; node = node->next) {
        if (node->value == value) {
            *position = index;
            return 1;
        }
        ++index;
    }
    return 0;
}

void print_list(const struct Node *head)
{
    for (const struct Node *node = head; node != NULL; node = node->next) {
        printf("%d -> ", node->value);
    }
    puts("NULL");
}

void clear_list(struct Node **head)
{
    while (*head != NULL) {
        struct Node *next = (*head)->next;
        free(*head);
        *head = next;
    }
}
