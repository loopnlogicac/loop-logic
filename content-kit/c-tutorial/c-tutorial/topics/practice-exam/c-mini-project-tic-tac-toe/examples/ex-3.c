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

static void show_board(const char board[3][3])
{
    for (int row = 0; row < 3; ++row) {
        printf("%c %c %c\n", board[row][0], board[row][1], board[row][2]);
    }
}

static char winner(const char board[3][3])
{
    for (int i = 0; i < 3; ++i) {
        if (board[i][0] != '.' && board[i][0] == board[i][1] &&
            board[i][1] == board[i][2]) {
            return board[i][0];
        }
        if (board[0][i] != '.' && board[0][i] == board[1][i] &&
            board[1][i] == board[2][i]) {
            return board[0][i];
        }
    }
    if (board[1][1] != '.' &&
        ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
         (board[0][2] == board[1][1] && board[1][1] == board[2][0]))) {
        return board[1][1];
    }
    return '.';
}

int main(void)
{
    char board[3][3] = {{'.', '.', '.'}, {'.', '.', '.'}, {'.', '.', '.'}};
    char player = 'X';
    int moves = 0;
    show_board((const char (*)[3])board);
    for (;;) {
        printf("%c row col (1-3):\n", player);
        char line[100];
        int status = read_line(stdin, line);
        if (status == 0) {
            puts("Unfinished");
            return ferror(stdin) ? EXIT_FAILURE : EXIT_SUCCESS;
        }
        const char *cursor = line;
        int row;
        int col;
        if (status < 0 || !number(&cursor, 1, 3, &row) ||
            !number(&cursor, 1, 3, &col) || !at_end(cursor)) {
            puts("invalid");
            continue;
        }
        --row;
        --col;
        if (board[row][col] != '.') {
            puts("occupied");
            continue;
        }
        board[row][col] = player;
        ++moves;
        show_board((const char (*)[3])board);
        char won = winner((const char (*)[3])board);
        if (won != '.') {
            printf("Winner: %c\n", won);
            return EXIT_SUCCESS;
        }
        if (moves == 9) {
            puts("Draw");
            return EXIT_SUCCESS;
        }
        player = player == 'X' ? 'O' : 'X';
    }
}
