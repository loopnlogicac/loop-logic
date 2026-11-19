class Desk implements AutoCloseable {
    private final String name;
    Desk(String name) { this.name = name; }
    void use() { System.out.println("use " + name); }
    @Override
    public void close() { System.out.println("close " + name); }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (Desk first = new Desk("A"); Desk second = new Desk("B")) {
            first.use();
            second.use();
            throw new IllegalStateException("work failed");
        } catch (IllegalStateException failure) {
            System.out.println(failure.getMessage());
        }
    }
}
