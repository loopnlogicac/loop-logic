import java.util.Scanner;

class Shop {
    static class Line {
        private final int price;
        private final int count;
        Line(int price, int count) { this.price = price; this.count = count; }
        int total() { return price * count; }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int price = input.nextInt();
        int count = input.nextInt();
        System.out.println(new Shop.Line(price, count).total());
    }
}
