import java.util.Scanner;
class Main {
    static int addBonus(int mark) {
        return mark + 5;
    }
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int mark = input.nextInt();
            System.out.println(addBonus(mark));
        }
    }
}
