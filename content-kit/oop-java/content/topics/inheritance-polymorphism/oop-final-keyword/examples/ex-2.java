final class Roll {
    private final int value;
    Roll(int value) { this.value = value; }
    int number() { return value; }
}

class Main {
    public static void main(String[] args) {
        System.out.println(new Roll(42).number());
    }
}
