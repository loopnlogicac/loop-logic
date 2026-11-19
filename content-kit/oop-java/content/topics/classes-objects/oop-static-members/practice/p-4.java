import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int firstCredits = input.nextInt();
            int secondCredits = input.nextInt();
            Enrollment.setRate(input.nextInt());
            Enrollment first = new Enrollment(firstCredits);
            Enrollment second = new Enrollment(secondCredits);
            System.out.println(first.bill() + " " + second.bill());
        }
    }
}
class Enrollment {
    private static int rate;
    private final int credits;
    Enrollment(int credits) {
        this.credits = credits;
    }
    static void setRate(int value) {
        rate = value;
    }
    int bill() {
        return credits * rate;
    }
}
