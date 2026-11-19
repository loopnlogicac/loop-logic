class Main {
    public static void main(String[] args) {
        int[][] seats = {{1, 2}, {3, 4}};
        search:
        for (int row = 0; row < seats.length; row++) {
            for (int column = 0; column < seats[row].length; column++) {
                if (seats[row][column] == 3) {
                    System.out.println(row + " " + column);
                    break search;
                }
            }
        }
    }
}
