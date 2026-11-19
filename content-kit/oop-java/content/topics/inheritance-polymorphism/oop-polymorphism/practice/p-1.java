import java.util.Scanner;
class Ride {
    private final int distance;
    Ride(int distance) { this.distance = distance; }
    int distance() { return distance; }
    int fare() { return distance * 4; }
}
class StudentRide extends Ride {
    StudentRide(int distance) { super(distance); }
    @Override
    int fare() { return distance() * 2; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            Ride[] rides = new Ride[count];
            for (int i = 0; i < count; i++) {
                int kind = input.nextInt();
                int distance = input.nextInt();
                rides[i] = kind == 0 ? new Ride(distance) : new StudentRide(distance);
            }
            int total = 0;
            for (Ride ride : rides) { total += ride.fare(); }
            System.out.println(total);
        }
    }
}
