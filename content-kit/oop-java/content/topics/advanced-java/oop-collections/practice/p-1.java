import java.util.Scanner;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        TreeSet<Integer> rolls = new TreeSet<>();
        for (int i = 0; i < n; i++) { rolls.add(input.nextInt()); }
        System.out.println(rolls);
    }
}
