#include <stdio.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

int main(void)
{
    Node node = {72, NULL};
    Node *cur = &node;
    cur->value += 5;
    printf("Mark: %d\n", node.value);
    return 0;
}
