import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Set<Integer> rolls = new TreeSet<>();
            for (int i = 0; i < n; i++) { rolls.add(input.nextInt()); }
            for (int roll : rolls) { System.out.println(roll); }
        }
    }
}
