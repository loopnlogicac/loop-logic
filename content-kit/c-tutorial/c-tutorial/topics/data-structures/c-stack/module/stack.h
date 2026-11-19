#ifndef TEACH_STACK_H
#define TEACH_STACK_H
#include <stddef.h>

enum { STACK_CAPACITY = 8 };
struct ArrayStack { int values[STACK_CAPACITY]; size_t count; };
struct StackNode { int value; struct StackNode *next; };
int array_push(struct ArrayStack *stack, int value);
int array_pop(struct ArrayStack *stack, int *value);
int array_peek(const struct ArrayStack *stack, int *value);
int linked_push(struct StackNode **top, int value);
int linked_pop(struct StackNode **top, int *value);
int linked_peek(const struct StackNode *top, int *value);
void linked_clear(struct StackNode **top);
#endif
