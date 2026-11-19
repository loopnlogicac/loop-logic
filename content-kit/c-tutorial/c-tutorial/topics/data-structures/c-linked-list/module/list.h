#ifndef TEACH_LIST_H
#define TEACH_LIST_H
#include <stddef.h>

struct Node {
    int value;
    struct Node *next;
};

int insert_at(struct Node **head, size_t position, int value);
int remove_at(struct Node **head, size_t position);
int find_value(const struct Node *head, int value, size_t *position);
void print_list(const struct Node *head);
void clear_list(struct Node **head);
#endif
