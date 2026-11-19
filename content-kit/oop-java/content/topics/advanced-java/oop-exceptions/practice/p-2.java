import java.util.Scanner;

class FundsException extends Exception {
    private static final long serialVersionUID = 1L;
}

class Main {
    static int withdraw(int balance, int amount) throws FundsException {
        if (amount > balance) { throw new FundsException(); }
        return balance - amount;
    }
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int balance = input.nextInt();
            int amount = input.nextInt();
            try {
                System.out.println(withdraw(balance, amount));
            } catch (FundsException failure) {
                System.out.println("DENIED");
            }
        }
    }
}
