class Main {
    public static void main(String[] args) throws Exception {
        Runnable task = new Runnable() {
            private int calls;
            @Override
            public void run() { calls++; System.out.println(calls); }
        };
        task.run();
        task.run();
    }
}
