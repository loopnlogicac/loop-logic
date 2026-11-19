import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int flag = input.nextInt();
            int value = input.nextInt();
            Integer mark = flag == 0 ? null : Integer.valueOf(value);
            int answer = mark == null ? -1 : mark.intValue();
            System.out.println(answer);
        }
    }
}
