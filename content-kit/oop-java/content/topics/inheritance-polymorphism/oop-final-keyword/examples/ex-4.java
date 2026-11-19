class Account {
    final int limit() { return 100; }
}
class LabAccount extends Account { }

class Main {
    public static void main(String[] args) {
        System.out.println(new LabAccount().limit());
    }
}
