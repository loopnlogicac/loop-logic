class Main {
    public static void main(String[] args) {
        Account account = new Account();
        account.deposit(200);
        System.out.println(account.getBalance());
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
