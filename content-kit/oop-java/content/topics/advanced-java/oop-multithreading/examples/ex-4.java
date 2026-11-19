class Main {
    public static void main(String[] args) throws Exception {
        Thread worker = new Thread(() -> {
            try {
                Thread.sleep(1000);
                System.out.println("Rest completed");
            } catch (InterruptedException failure) {
                Thread.currentThread().interrupt();
                System.out.println("Rest cancelled");
            }
        });
        worker.start();
        worker.interrupt();
        worker.join();
    }
}
