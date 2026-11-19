class Main {
    public static void main(String[] args) {
        StringBuilder rolls = new StringBuilder();
        for (int roll = 1; roll <= 3; roll++) {
            if (roll > 1) {
                rolls.append(", ");
            }
            rolls.append(roll);
        }
        System.out.println(rolls.toString());
    }
}
