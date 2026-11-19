import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Wallet empty = new Wallet();
            Wallet funded = new Wallet(input.nextInt());
            System.out.println(empty.balance + " " + funded.balance);
        }
    }
}
class Wallet {
    int balance;
    Wallet() {
        this(0);
    }
    Wallet(int balance) {
        this.balance = balance;
    }
}
