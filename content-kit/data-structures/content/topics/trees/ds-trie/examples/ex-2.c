#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Trie {
    struct Trie *child[26];
    int terminal, count;
} Trie;
Trie *make_node(void)
{
    Trie *p = malloc(sizeof *p);
    if (p != NULL) {
        *p = (Trie){0};
    }
    return p;
}
void destroy(Trie *r)
{
    if (r != NULL) {
        for (int i = 0; i < 26; i++) {
            destroy(r->child[i]);
        }
        free(r);
    }
}
Trie *find(Trie *r, const char *word)
{
    for (int i = 0; word[i] != '\0' && r != NULL; i++) {
        r = r->child[word[i] - 'a'];
    }
    return r;
}
int valid_word(const char *word)
{
    size_t n = strlen(word);
    if (n < 1 || n > 6) {
        return 0;
    }
    for (size_t i = 0; i < n; i++) {
        if (word[i] < 'a' || word[i] > 'z') {
            return 0;
        }
    }
    return 1;
}
int insert(Trie *root, const char *word)
{
    Trie *old = find(root, word);
    if (old != NULL && old->terminal) {
        return 1;
    }
    Trie *cur = root, *path[7];
    int length = 1;
    path[0] = root;
    for (int i = 0; word[i] != '\0'; i++) {
        int index = word[i] - 'a';
        if (cur->child[index] == NULL) {
            cur->child[index] = make_node();
            if (cur->child[index] == NULL) {
                return 0;
            }
        }
        cur = cur->child[index];
        path[length++] = cur;
    }
    cur->terminal = 1;
    for (int i = 0; i < length; i++) {
        path[i]->count++;
    }
    return 1;
}

int read_words(Trie *root)
{
    int n;
    char word[32];
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%31s", word) != 1 || !valid_word(word) || !insert(root, word)) {
            return 0;
        }
    }
    return 1;
}
int main(void)
{
    Trie *root = make_node();
    if (root == NULL) {
        return 1;
    }
    puts("Count and lowercase words:");
    if (!read_words(root)) {
        destroy(root);
        return 1;
    }
    char query[32];
    puts("Query:");
    if (scanf("%31s", query) != 1 || !valid_word(query)) {
        destroy(root);
        return 1;
    }
    Trie *cur = find(root, query);
    printf("word=%d prefix-count=%d\n", cur != NULL && cur->terminal, cur == NULL ? 0 : cur->count);
    destroy(root);
    return 0;
}
