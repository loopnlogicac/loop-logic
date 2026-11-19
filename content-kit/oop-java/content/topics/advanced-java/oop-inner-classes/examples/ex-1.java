class Library {
    static class Entry {
        private final int id;
        Entry(int id) { this.id = id; }
        int id() { return id; }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(new Library.Entry(7).id());
    }
}
