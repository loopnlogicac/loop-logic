import java.util.Scanner;

class Counter {
    private int value;
    void increment() { value++; }
    int value() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        Counter model = new Counter();
        for (int i = 0; i < n; i++) { model.increment(); }
        System.out.println(model.value());
    }
}
