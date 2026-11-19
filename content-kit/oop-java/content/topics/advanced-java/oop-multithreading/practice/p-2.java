import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            ExecutorService pool = Executors.newSingleThreadExecutor();
            try {
                Future<Integer> answer = pool.submit(() -> {
                    int sum = 0;
                    for (int i = 1; i <= n; i++) { sum += i * i; }
                    return sum;
                });
                System.out.println(answer.get());
            } finally { pool.shutdown(); }
        }
    }
}
