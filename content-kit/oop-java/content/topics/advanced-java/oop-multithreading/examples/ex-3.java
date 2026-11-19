import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;



class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        try {
            Future<Integer> total = pool.submit(() -> 12 + 18);
            System.out.println(total.get());
        } finally {
            pool.shutdown();
        }
    }
}
