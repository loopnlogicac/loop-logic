class Student {
    private final int roll;
    Student(int roll) { this.roll = roll; }
    int roll() { return roll; }
}
class Scholar extends Student {
    private final int award;
    Scholar(int roll, int award) {
        super(roll);
        this.award = award;
    }
    int award() { return award; }
}

class Main {
    public static void main(String[] args) {
        Scholar scholar = new Scholar(42, 6000);
        System.out.println(scholar.roll());
        System.out.println(scholar.award());
    }
}
