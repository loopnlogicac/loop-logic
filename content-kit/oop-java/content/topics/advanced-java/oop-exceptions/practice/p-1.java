import java.util.Scanner;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            for (int i = 0; i < n; i++) {
                try {
                    int mark = Integer.parseInt(input.next());
                    if (mark < 0 || mark > 100) {
                        System.out.println("RANGE");
                    } else {
                        System.out.println("ACCEPT " + mark);
                    }
                } catch (NumberFormatException failure) {
                    System.out.println("FORMAT");
                }
            }
        }
    }
}
