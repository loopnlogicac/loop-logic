class Main {
    public static void main(String[] args) throws Exception {
        int[] result = new int[1];
        Runnable task = () -> result[0] = 6 * 7;
        Thread worker = new Thread(task);
        worker.start();
        worker.join();
        System.out.println(result[0]);
    }
}
