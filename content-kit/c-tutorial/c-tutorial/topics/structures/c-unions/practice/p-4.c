#include <stdio.h>

union Value { int count; double amount; };

enum Kind { ITEM_COUNT, ITEM_AMOUNT };
struct Item {
    enum Kind kind;
    union Value value;
};

int main(void)
{
    int count;
    puts("Item count and tagged values:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 10) {
        return 1;
    }
    struct Item items[10];
    for (int i = 0; i < count; i++) {
        int kind, input;
        if (scanf("%d %d", &kind, &input) != 2 || kind < 0 || kind > 1
            || input < 0 || input > 100) {
            return 1;
        }
        items[i].kind = kind == 0 ? ITEM_COUNT : ITEM_AMOUNT;
        if (kind == 0) {
            items[i].value.count = input;
        } else {
            items[i].value.amount = (double)input;
        }
    }
    int total = 0;
    for (int i = 0; i < count; i++) {
        if (items[i].kind == ITEM_COUNT) {
            total += items[i].value.count;
        }
    }
    printf("%d\n", total);
    return 0;
}
