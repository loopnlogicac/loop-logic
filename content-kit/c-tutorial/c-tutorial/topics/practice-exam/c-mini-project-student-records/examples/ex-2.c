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

enum { MAX_STUDENTS = 20 };
struct Student { int roll; int mark; };

static int find_roll(const struct Student records[], int count, int roll)
{
    for (int i = 0; i < count; ++i) {
        if (records[i].roll == roll) {
            return i;
        }
    }
    return -1;
}

static int load(struct Student records[], int *count)
{
    FILE *file = fopen("students.txt", "r");
    if (file == NULL) {
        return 0;
    }
    char line[100];
    int status;
    int ok = 1;
    while ((status = read_line(file, line)) != 0) {
        const char *cursor = line;
        int roll;
        int mark;
        if (status < 0 || *count == MAX_STUDENTS ||
            !number(&cursor, 1, 9999, &roll) || !number(&cursor, 0, 100, &mark) ||
            !at_end(cursor) || find_roll(records, *count, roll) >= 0) {
            ok = 0;
            break;
        }
        records[(*count)++] = (struct Student){roll, mark};
    }
    int failed = ferror(file);
    int closed = fclose(file);
    return ok && !failed && closed != EOF;
}

static int save(const struct Student records[], int count)
{
    FILE *file = fopen("students.tmp", "w");
    if (file == NULL) {
        return 0;
    }
    int ok = 1;
    for (int i = 0; i < count; ++i) {
        if (fprintf(file, "%d %d\n", records[i].roll, records[i].mark) < 0) {
            ok = 0;
            break;
        }
    }
    if (fclose(file) == EOF) {
        ok = 0;
    }
    if (!ok || rename("students.tmp", "students.txt") != 0) {
        (void)remove("students.tmp");
        return 0;
    }
    return 1;
}

int main(void)
{
    struct Student records[MAX_STUDENTS];
    int count = 0;
    if (!load(records, &count)) {
        fputs("Cannot load students.txt\n", stderr);
        return EXIT_FAILURE;
    }
    puts("A roll mark | L | S roll | U roll mark | D roll | Q");
    char line[100];
    int status;
    while ((status = read_line(stdin, line)) != 0) {
        if (status < 0) {
            puts("invalid");
            continue;
        }
        char command = line[0];
        const char *cursor = line + 1;
        if ((command == 'Q' || command == 'L') && at_end(cursor)) {
            if (command == 'Q') {
                break;
            }
            for (int i = 0; i < count; ++i) {
                printf("%d %d\n", records[i].roll, records[i].mark);
            }
            printf("Count: %d\n", count);
            continue;
        }
        int roll;
        int mark = 0;
        int is_pair = command == 'A' || command == 'U';
        if ((!is_pair && command != 'S' && command != 'D') ||
            !isspace((unsigned char)*cursor) || !number(&cursor, 1, 9999, &roll) ||
            (is_pair && !number(&cursor, 0, 100, &mark)) || !at_end(cursor)) {
            puts("invalid");
            continue;
        }
        int index = find_roll(records, count, roll);
        if (command == 'S') {
            if (index < 0) {
                puts("missing");
            } else {
                printf("%d %d\n", records[index].roll, records[index].mark);
            }
            continue;
        }
        if (command == 'A') {
            if (index >= 0 || count == MAX_STUDENTS) {
                puts(index >= 0 ? "duplicate" : "full");
                continue;
            }
            records[count++] = (struct Student){roll, mark};
        } else {
            if (index < 0) {
                puts("missing");
                continue;
            }
            if (command == 'U') {
                records[index].mark = mark;
            } else {
                for (int i = index; i + 1 < count; ++i) {
                    records[i] = records[i + 1];
                }
                --count;
            }
        }
        if (!save(records, count)) {
            fputs("Save failed; stopping\n", stderr);
            return EXIT_FAILURE;
        }
        puts("saved");
    }
    return ferror(stdin) ? EXIT_FAILURE : EXIT_SUCCESS;
}
