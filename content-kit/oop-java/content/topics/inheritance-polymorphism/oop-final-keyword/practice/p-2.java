import java.util.Scanner;
final class Snapshot {
    private final int[] marks;
    Snapshot(int[] marks) { this.marks = marks.clone(); }
    int sum() {
        int total = 0;
        for (int mark : marks) { total += mark; }
        return total;
    }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            int[] marks = new int[count];
            for (int i = 0; i < count; i++) { marks[i] = input.nextInt(); }
            Snapshot snapshot = new Snapshot(marks);
            int replacement = input.nextInt();
            if (count > 0) { marks[0] = replacement; }
            System.out.println(snapshot.sum());
        }
    }
}
