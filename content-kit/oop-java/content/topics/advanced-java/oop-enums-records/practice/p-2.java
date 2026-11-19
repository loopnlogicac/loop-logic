import java.util.Scanner;

record Bill(int quantity, int unitPrice) {
    int total() { return quantity * unitPrice; }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            Bill bill = new Bill(input.nextInt(), input.nextInt());
            System.out.println(bill.total());
        }
    }
}
