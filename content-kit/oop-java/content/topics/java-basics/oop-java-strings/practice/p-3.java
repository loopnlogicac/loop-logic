import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String code = input.next();
            StringBuilder reversed = new StringBuilder();
            for (int i = code.length() - 1; i >= 0; i--) {
                reversed.append(code.charAt(i));
            }
            System.out.println(reversed.toString());
        }
    }
}
