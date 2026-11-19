import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        String text = input.nextLine().strip();
        System.out.println(text.isEmpty() ? "MISSING" : "Hello " + text);
    }
}
