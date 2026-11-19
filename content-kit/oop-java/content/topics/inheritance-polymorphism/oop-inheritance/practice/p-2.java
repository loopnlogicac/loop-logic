import java.util.Scanner;
class Journey {
    private final int distance;
    Journey(int distance) { this.distance = distance; }
    int distance() { return distance; }
}
class MeteredJourney extends Journey {
    private final int rate;
    MeteredJourney(int distance, int rate) {
        super(distance);
        this.rate = rate;
    }
    int fare() { return distance() * rate; }
}
class StudentJourney extends MeteredJourney {
    private final int discount;
    StudentJourney(int distance, int rate, int discount) {
        super(distance, rate);
        this.discount = discount;
    }
    @Override
    int fare() { return Math.max(0, super.fare() - discount); }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int distance = input.nextInt();
            int rate = input.nextInt();
            int discount = input.nextInt();
            System.out.println(new StudentJourney(distance, rate, discount).fare());
        }
    }
}
