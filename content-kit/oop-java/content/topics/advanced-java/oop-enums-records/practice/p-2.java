import java.util.Scanner;

record Mark(int value) {
    Mark {
        if (value < 0 || value > 100) { throw new IllegalArgumentException("range"); }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        try {
            Mark mark = new Mark(input.nextInt());
            System.out.println(mark.value());
        } catch (IllegalArgumentException problem) {
            System.out.println("INVALID");
        }
    }
}
