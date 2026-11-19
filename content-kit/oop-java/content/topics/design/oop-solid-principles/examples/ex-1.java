class MixedBill {
    String receipt(int quantity, int price) { return "BDT " + quantity * price; }
}
class Bill { int total(int quantity, int price) { return quantity * price; } }
class ReceiptText { String render(int total) { return "BDT " + total; } }

class Main {
    public static void main(String[] args) {
        MixedBill oldBill = new MixedBill();
        System.out.println(oldBill.receipt(3, 100));
        Bill bill = new Bill();
        ReceiptText text = new ReceiptText();
        System.out.println(text.render(bill.total(3, 100)));
    }
}
