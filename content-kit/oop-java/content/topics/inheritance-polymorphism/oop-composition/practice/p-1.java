import java.util.Scanner;
class RateCalculator {
    private final int rate;
    RateCalculator(int rate) { this.rate = rate; }
    int cost(int weight) { return weight * rate; }
}
class Parcel {
    private final RateCalculator calculator;
    Parcel(RateCalculator calculator) { this.calculator = calculator; }
    int cost(int weight) { return calculator.cost(weight); }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int weight = input.nextInt();
            RateCalculator calculator = new RateCalculator(input.nextInt());
            Parcel parcel = new Parcel(calculator);
            System.out.println(parcel.cost(weight));
        }
    }
}
