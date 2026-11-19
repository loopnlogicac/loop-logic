import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        try {
            Future<Integer> first = pool.submit(() -> 20 + 1);
            Future<Integer> second = pool.submit(() -> 30 + 1);
            System.out.println(first.get() + second.get());
        } finally {
            pool.shutdown();
        }
    }
}
