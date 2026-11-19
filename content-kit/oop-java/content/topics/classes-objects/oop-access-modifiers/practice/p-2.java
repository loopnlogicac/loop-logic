import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Account account = new Account();
            System.out.println(account.deposit(input.nextInt()));
            System.out.println(account.getBalance());
        }
    }
}
class Account {
    private int balance;
    public boolean deposit(int amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }
    public int getBalance() {
        return balance;
    }
}
