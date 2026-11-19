class Gate implements AutoCloseable {
    void open() { System.out.println("Opened"); }
    @Override
    public void close() { throw new IllegalStateException("close"); }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (Gate gate = new Gate()) {
            gate.open();
            throw new IllegalStateException("body");
        } catch (IllegalStateException problem) {
            System.out.println(problem.getMessage());
            System.out.println(problem.getSuppressed()[0].getMessage());
        }
    }
}
