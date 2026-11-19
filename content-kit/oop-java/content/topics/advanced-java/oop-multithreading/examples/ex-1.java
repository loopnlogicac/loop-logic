class Main {
    public static void main(String[] args) throws Exception {
        Runnable task = () -> System.out.println("Worker finished");
        Thread worker = new Thread(task);
        worker.start();
        worker.join();
        System.out.println("Main continues");
    }
}
