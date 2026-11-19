class Reader implements AutoCloseable {
    @Override
    public void close() { System.out.println("Closed"); }
    void read() { System.out.println("Read"); }
}

class Main {
    public static void main(String[] args) throws Exception {
        try (Reader reader = new Reader()) {
            reader.read();
        }
    }
}
