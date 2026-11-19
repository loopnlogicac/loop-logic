import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int book = input.nextInt();
        int member = input.nextInt();
        System.out.println(book > 0 && member > 0 ? "READY" : "MISSING");
    }
}
