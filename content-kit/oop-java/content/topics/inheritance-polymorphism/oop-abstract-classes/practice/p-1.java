import java.util.Scanner;
abstract class Receipt {
    abstract int subtotal();
    final int total() {
        int amount = subtotal();
        return amount == 0 ? 0 : amount + 50;
    }
}
class ItemReceipt extends Receipt {
    private final int quantity;
    private final int price;
    ItemReceipt(int quantity, int price) {
        this.quantity = quantity;
        this.price = price;
    }
    @Override
    int subtotal() { return quantity * price; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Receipt receipt = new ItemReceipt(input.nextInt(), input.nextInt());
            System.out.println(receipt.total());
        }
    }
}
