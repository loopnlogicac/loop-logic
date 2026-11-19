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

int add_poly(Term **result, const Term *a, const Term *b)
{
    Term **tail = result;
    while (a != NULL || b != NULL) {
        int coefficient;
        int exponent;
        if (b == NULL || (a != NULL && a->exponent > b->exponent)) {
            coefficient = a->coefficient;
            exponent = a->exponent;
            a = a->next;
        } else if (a == NULL || b->exponent > a->exponent) {
            coefficient = b->coefficient;
            exponent = b->exponent;
            b = b->next;
        } else {
            coefficient = a->coefficient + b->coefficient;
            exponent = a->exponent;
            a = a->next;
            b = b->next;
        }
        if (coefficient != 0) {
            Term *term = malloc(sizeof *term);
            if (term == NULL) {
                return 0;
            }
            *term = (Term){coefficient, exponent, NULL};
            *tail = term;
            tail = &term->next;
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
    if (!add_poly(&result, a, b)) {
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
