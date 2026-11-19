#include <stdio.h>
#define R 3
#define C 4
int main(void)
{
    int grid[R][C] = {{0,0,1,0},{1,0,0,0},{0,0,1,0}};
    int distance[R][C], queue[R*C], head = 0, tail = 0;
    const int dr[] = {-1,0,1,0}, dc[] = {0,1,0,-1};
    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) { distance[r][c] = -1; }
    }
    distance[0][0] = 0;
    queue[tail++] = 0;
    while (head < tail) {
        int cell = queue[head++], r = cell / C, c = cell % C;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C &&
                grid[nr][nc] == 0 && distance[nr][nc] == -1) {
                distance[nr][nc] = distance[r][c] + 1;
                queue[tail++] = nr*C + nc;
            }
        }
    }
    printf("%d\n", distance[2][3]);
    return 0;
}
