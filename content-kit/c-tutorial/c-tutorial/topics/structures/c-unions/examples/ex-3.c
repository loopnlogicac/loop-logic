#include <stdio.h>

union Value { int count; double amount; };

enum Kind { ITEM_COUNT, ITEM_AMOUNT };
struct Item {
    enum Kind kind;
    union Value value;
};

int main(void)
{
    struct Item items[] = {
        {.kind = ITEM_COUNT, .value = {.count = 3}},
        {.kind = ITEM_AMOUNT, .value = {.amount = 42.5}}
    };
    for (size_t i = 0; i < 2; i++) {
        switch (items[i].kind) {
            case ITEM_COUNT:
                printf("Count: %d\n", items[i].value.count);
                break;
            case ITEM_AMOUNT:
                printf("Amount: %.1f\n", items[i].value.amount);
                break;
        }
    }
    return 0;
}
