import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Wallet wallet = new Wallet(input.nextInt());
            System.out.println(wallet.withdraw(input.nextInt()));
            System.out.println(wallet.balance());
        }
    }
}
class Wallet {
    private int balance;
    Wallet(int balance) {
        this.balance = balance;
    }
    public boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
    public int balance() {
        return balance;
    }
}
