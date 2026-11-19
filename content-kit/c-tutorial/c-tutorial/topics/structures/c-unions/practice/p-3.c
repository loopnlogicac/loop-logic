#include <stdio.h>

union Value { int count; double amount; };

enum Kind { ITEM_COUNT, ITEM_AMOUNT };
struct Item {
    enum Kind kind;
    union Value value;
};

int main(void)
{
    int kind, input;
    puts("Kind and value:");
    if (scanf("%d %d", &kind, &input) != 2 || kind < 0 || kind > 1
        || input < 0 || input > 100) {
        return 1;
    }
    struct Item item;
    if (kind == 0) {
        item.kind = ITEM_COUNT;
        item.value.count = input;
    } else {
        item.kind = ITEM_AMOUNT;
        item.value.amount = (double)input;
    }
    if (item.kind == ITEM_COUNT) {
        printf("count %d\n", item.value.count);
    } else {
        printf("amount %.1f\n", item.value.amount);
    }
    return 0;
}
