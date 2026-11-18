#include <stdio.h>
#include <stdlib.h>

typedef struct Term {
    int coefficient;
    int exponent;
    struct Term *next;
} Term;

void destroy(Term *head)
{
    while (head != NULL) {
        Term *next = head->next;
        free(head);
        head = next;
    }
}

int add_term(Term **head, int coefficient, int exponent)
{
    if (coefficient == 0) {
        return 1;
    }
    while (*head != NULL && (*head)->exponent > exponent) {
        head = &(*head)->next;
    }
    if (*head != NULL && (*head)->exponent == exponent) {
        (*head)->coefficient += coefficient;
        if ((*head)->coefficient == 0) {
            Term *victim = *head;
            *head = victim->next;
            free(victim);
        }
        return 1;
    }
    Term *term = malloc(sizeof *term);
    if (term == NULL) {
        return 0;
    }
    *term = (Term){coefficient, exponent, *head};
    *head = term;
    return 1;
}

int multiply(Term **result, const Term *a, const Term *b)
{
    for (const Term *left = a; left != NULL; left = left->next) {
        for (const Term *right = b; right != NULL; right = right->next) {
            if (!add_term(result, left->coefficient * right->coefficient,
                          left->exponent + right->exponent)) {
                return 0;
            }
        }
    }
    return 1;
}

void show(const Term *head)
{
    printf("Terms:");
    for (const Term *cur = head; cur != NULL; cur = cur->next) {
        printf(" (%d,%d)", cur->coefficient, cur->exponent);
    }
    putchar('\n');
}

int read_poly(Term **head)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 8) {
        return 0;
    }
    for (int i = 0; i < n; i++) {
        int coefficient;
        int exponent;
        if (scanf("%d%d", &coefficient, &exponent) != 2
            || coefficient < -9 || coefficient > 9 || exponent < 0 || exponent > 9
            || !add_term(head, coefficient, exponent)) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    Term *a = NULL;
    Term *b = NULL;
    Term *result = NULL;
    printf("Enter two polynomials: term count then coefficient/exponent pairs: ");
    if (!read_poly(&a) || !read_poly(&b)) {
        destroy(a);
        destroy(b);
        return 1;
    }
    if (!multiply(&result, a, b)) {
        destroy(a);
        destroy(b);
        destroy(result);
        return 1;
    }
    show(result);
    destroy(a);
    destroy(b);
    destroy(result);
    return 0;
}
