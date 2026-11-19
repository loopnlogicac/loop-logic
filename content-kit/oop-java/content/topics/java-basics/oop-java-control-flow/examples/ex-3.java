class Main {
    public static void main(String[] args) {
        int day = 5;
        String label = switch (day) {
            case 5, 6 -> "Weekend";
            default -> "Class day";
        };
        System.out.println(label);
    }
}
