class Main {
    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(() -> {
            try {
                Thread.sleep(1);
            } catch (InterruptedException problem) {
                Thread.currentThread().interrupt();
            }
        });
        worker.start();
        worker.join();
        System.out.println("Finished");
    }
}
