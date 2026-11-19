class FailingDesk implements AutoCloseable {
    void use() { throw new IllegalStateException("work"); }
    @Override
    public void close() { throw new IllegalStateException("close"); }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (FailingDesk desk = new FailingDesk()) {
            desk.use();
        } catch (IllegalStateException failure) {
            System.out.println(failure.getMessage());
            System.out.println(failure.getSuppressed()[0].getMessage());
        }
    }
}
