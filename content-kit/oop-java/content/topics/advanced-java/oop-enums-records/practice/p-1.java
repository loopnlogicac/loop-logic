import java.util.Scanner;

enum LoanKind {
    REGULAR(2), SHORT(5);
    private final int rate;
    LoanKind(int rate) { this.rate = rate; }
    int fee(int days) { return rate * days; }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            LoanKind kind = LoanKind.valueOf(input.next());
            System.out.println(kind.fee(input.nextInt()));
        }
    }
}
