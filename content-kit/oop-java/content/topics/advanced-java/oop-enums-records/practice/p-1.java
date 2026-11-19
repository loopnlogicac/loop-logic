import java.util.Scanner;

enum Status { AVAILABLE, BORROWED }

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        Status status = Status.valueOf(input.next());
        int days = input.nextInt();
        int fee = switch (status) {
            case AVAILABLE -> 0;
            case BORROWED -> days * 5;
        };
        System.out.println(fee);
    }
}
