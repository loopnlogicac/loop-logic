#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Contact {
    char name[25];
    char phone[17];
    struct Contact *next;
} Contact;
static void clear(Contact *head)
{
    while (head != NULL) { Contact *old = head; head = head->next; free(old); }
}
static Contact *search(Contact *head, const char *name)
{
    while (head != NULL && strcmp(head->name, name) != 0) { head = head->next; }
    return head;
}
static int valid(const char *name, const char *phone)
{
    size_t n = strlen(name), p = strlen(phone), first = phone[0] == '+' ? 1U : 0U;
    if (n == 0 || n > 24 || p <= first || p > 16) { return 0; }
    for (size_t i = 0; i < n; i++) {
        unsigned char c = (unsigned char)name[i];
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ||
              (c >= '0' && c <= '9') || c == '_')) { return 0; }
    }
    for (size_t i = first; i < p; i++) {
        if (phone[i] < '0' || phone[i] > '9') { return 0; }
    }
    return 1;
}
static int add(Contact **head, const char *name, const char *phone)
{
    int count = 0;
    for (Contact *cur = *head; cur != NULL; cur = cur->next) { count++; }
    if (!valid(name, phone) || search(*head, name) != NULL || count >= 32) { return 0; }
    Contact *node = malloc(sizeof *node);
    if (node == NULL) { return -1; }
    strcpy(node->name, name); strcpy(node->phone, phone);
    node->next = *head; *head = node;
    return 1;
}
static int erase(Contact **head, const char *name)
{
    Contact **link = head;
    while (*link != NULL && strcmp((*link)->name, name) != 0) { link = &(*link)->next; }
    if (*link == NULL) { return 0; }
    Contact *old = *link; *link = old->next; free(old);
    return 1;
}
static void sort(Contact **head)
{
    Contact *sorted = NULL;
    while (*head != NULL) {
        Contact *node = *head;
        *head = node->next;
        Contact **link = &sorted;
        while (*link != NULL && strcmp((*link)->name, node->name) < 0) {
            link = &(*link)->next;
        }
        node->next = *link; *link = node;
    }
    *head = sorted;
}
static int save_contacts(Contact *head)
{
    FILE *file = fopen("contacts.txt", "w");
    if (file == NULL) { return 0; }
    int good = 1;
    for (Contact *cur = head; cur != NULL; cur = cur->next) {
        if (fprintf(file, "%s %s\n", cur->name, cur->phone) < 0) { good = 0; break; }
    }
    if (fclose(file) != 0) { good = 0; }
    return good;
}
/* 1 is a full line, 0 is EOF, -1 is an overlong line or a read error. */
static int read_line(FILE *file, char line[160])
{
    if (fgets(line, 160, file) == NULL) { return ferror(file) ? -1 : 0; }
    if (strchr(line, '\n') != NULL) { return 1; }
    if (feof(file)) { return 1; }
    int c;
    while ((c = fgetc(file)) != '\n' && c != EOF) { }
    return -1;
}
static int load_contacts(Contact **head)
{
    FILE *file = fopen("contacts.txt", "r");
    if (file == NULL) { return 0; }
    Contact *temp = NULL;
    char line[160], name[160], phone[160], extra;
    int status, good = 1;
    while ((status = read_line(file, line)) == 1) {
        if (sscanf(line, "%159s %159s %c", name, phone, &extra) != 2 ||
            add(&temp, name, phone) != 1) { good = 0; break; }
    }
    if (status < 0 || ferror(file)) { good = 0; }
    if (fclose(file) != 0) { good = 0; }
    if (!good) { clear(temp); return 0; }
    /* Front insertion reverses the file; reverse again to restore file order. */
    Contact *restored = NULL;
    while (temp != NULL) {
        Contact *node = temp; temp = temp->next; node->next = restored; restored = node;
    }
    clear(*head); *head = restored;
    return 1;
}

int main(void)
{
    Contact *head = NULL;
    char line[160], command, name[160], phone[160], extra;
    puts("A name phone | F name | D name | S sort | L list | W save | R load | Q quit");
    int status;
    while ((status = read_line(stdin, line)) != 0) {
        if (status < 0) { puts("invalid line"); if (ferror(stdin)) { break; } continue; }
        int count = sscanf(line, " %c %159s %159s %c", &command, name, phone, &extra);
        if (count == 3 && command == 'A') {
            int result = add(&head, name, phone);
            puts(result == 1 ? "added" : result == 0 ? "rejected" : "no memory");
        } else if (count == 2 && command == 'F') {
            Contact *found = search(head, name);
            if (found != NULL) { printf("%s %s\n", found->name, found->phone); }
            else { puts("not found"); }
        } else if (count == 2 && command == 'D') {
            puts(erase(&head, name) ? "deleted" : "not found");
        } else if (count == 1 && command == 'S') { sort(&head); puts("sorted"); }
        else if (count == 1 && command == 'L') {
            puts("contacts:");
            for (Contact *cur = head; cur != NULL; cur = cur->next) {
                printf("%s %s\n", cur->name, cur->phone);
            }
        } else if (count == 1 && command == 'W') {
            puts(save_contacts(head) ? "saved" : "save failed");
        } else if (count == 1 && command == 'R') {
            puts(load_contacts(&head) ? "loaded" : "load failed");
        } else if (count == 1 && command == 'Q') { break; }
        else { puts("invalid command"); }
    }
    clear(head);
    return 0;
}
