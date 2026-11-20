#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int number(const char **cursor, int low, int high, int *answer)
{
    char *end;
    errno = 0;
    long value = strtol(*cursor, &end, 10);
    if (end == *cursor || errno == ERANGE || value < low || value > high ||
        (*end != '\0' && !isspace((unsigned char)*end))) {
        return 0;
    }
    *cursor = end;
    *answer = (int)value;
    return 1;
}

static int at_end(const char *cursor)
{
    while (isspace((unsigned char)*cursor)) {
        ++cursor;
    }
    return *cursor == '\0';
}

static int read_line(FILE *stream, char line[100])
{
    if (fgets(line, 100, stream) == NULL) {
        return 0;
    }
    if (strchr(line, '\n') == NULL && !feof(stream)) {
        int next = fgetc(stream);
        if (next != EOF && next != '\n') {
            do {
                next = fgetc(stream);
            } while (next != EOF && next != '\n');
            return -1;
        }
    }
    return 1;
}

enum { MAX_TRANSACTIONS = 100, MAX_BALANCE = 1000000, MAX_AMOUNT = 100000 };
struct Transaction { char type; int amount; };
struct Account {
    int balance;
    int count;
    struct Transaction history[MAX_TRANSACTIONS];
};
enum result { APPLIED, INVALID_AMOUNT, NO_FUNDS, BALANCE_LIMIT, HISTORY_FULL };

static enum result apply(struct Account *account, char type, int amount)
{
    if ((type != 'D' && type != 'W') || amount <= 0 || amount > MAX_AMOUNT) {
        return INVALID_AMOUNT;
    }
    if (account->count == MAX_TRANSACTIONS) {
        return HISTORY_FULL;
    }
    if (type == 'W' && amount > account->balance) {
        return NO_FUNDS;
    }
    if (type == 'D' && account->balance > MAX_BALANCE - amount) {
        return BALANCE_LIMIT;
    }
    account->balance += type == 'D' ? amount : -amount;
    account->history[account->count++] = (struct Transaction){type, amount};
    return APPLIED;
}

static int load(struct Account *account)
{
    FILE *file = fopen("account.txt", "r");
    if (file == NULL) {
        return 0;
    }
    char line[100];
    int status;
    int ok = 1;
    while ((status = read_line(file, line)) != 0) {
        const char *cursor = line + 1;
        int amount;
        if (status < 0 || !isspace((unsigned char)*cursor) ||
            !number(&cursor, 1, MAX_AMOUNT, &amount) || !at_end(cursor) ||
            apply(account, line[0], amount) != APPLIED) {
            ok = 0;
            break;
        }
    }
    int failed = ferror(file);
    int closed = fclose(file);
    return ok && !failed && closed != EOF;
}

static int save(const struct Account *account)
{
    FILE *file = fopen("account.tmp", "w");
    if (file == NULL) {
        return 0;
    }
    int ok = 1;
    for (int i = 0; i < account->count; ++i) {
        const struct Transaction *entry = &account->history[i];
        if (fprintf(file, "%c %d\n", entry->type, entry->amount) < 0) {
            ok = 0;
            break;
        }
    }
    if (fclose(file) == EOF) {
        ok = 0;
    }
    if (!ok || rename("account.tmp", "account.txt") != 0) {
        (void)remove("account.tmp");
        return 0;
    }
    return 1;
}

static void show_history(const struct Account *account)
{
    int balance = 0;
    for (int i = 0; i < account->count; ++i) {
        const struct Transaction *entry = &account->history[i];
        balance += entry->type == 'D' ? entry->amount : -entry->amount;
        printf("%d %c %d -> %d\n", i + 1, entry->type, entry->amount, balance);
    }
    printf("Entries: %d\n", account->count);
}

int main(void)
{
    struct Account account = {0};
    if (!load(&account)) {
        fputs("Cannot load account.txt\n", stderr);
        return EXIT_FAILURE;
    }
    puts("D amount | W amount | B | H | Q (whole taka)");
    char line[100];
    int status;
    while ((status = read_line(stdin, line)) != 0) {
        if (status < 0) {
            puts("invalid");
            continue;
        }
        char command = line[0];
        const char *cursor = line + 1;
        if ((command == 'B' || command == 'H' || command == 'Q') && at_end(cursor)) {
            if (command == 'Q') {
                break;
            }
            if (command == 'B') {
                printf("Balance: %d\n", account.balance);
            } else {
                show_history(&account);
            }
            continue;
        }
        int amount;
        if ((command != 'D' && command != 'W') ||
            !isspace((unsigned char)*cursor) || !number(&cursor, 1, MAX_AMOUNT, &amount) ||
            !at_end(cursor)) {
            puts("invalid");
            continue;
        }
        enum result outcome = apply(&account, command, amount);
        if (outcome != APPLIED) {
            if (outcome == NO_FUNDS) {
                puts("insufficient");
            } else if (outcome == BALANCE_LIMIT) {
                puts("balance limit");
            } else {
                puts(outcome == HISTORY_FULL ? "history full" : "invalid");
            }
            continue;
        }
        if (!save(&account)) {
            fputs("Save failed; stopping\n", stderr);
            return EXIT_FAILURE;
        }
        printf("Saved balance: %d\n", account.balance);
    }
    return ferror(stdin) ? EXIT_FAILURE : EXIT_SUCCESS;
}
