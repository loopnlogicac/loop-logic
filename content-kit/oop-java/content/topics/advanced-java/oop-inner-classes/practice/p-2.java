import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int rate = input.nextInt();
        int days = input.nextInt();
        class Fee {
            int amount() { return rate * days; }
        }
        System.out.println(new Fee().amount());
    }
}
