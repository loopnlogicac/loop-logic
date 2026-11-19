import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            List<String> rooms = new ArrayList<>();
            for (int i = 0; i < n; i++) { rooms.add(input.next()); }
            rooms.stream().distinct().sorted().forEach(System.out::println);
        }
    }
}
