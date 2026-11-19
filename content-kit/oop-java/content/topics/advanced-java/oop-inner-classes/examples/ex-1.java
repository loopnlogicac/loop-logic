class Shelf {
    static class Label {
        private final int number;
        Label(int number) { this.number = number; }
        String text() { return "Shelf " + number; }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Shelf.Label label = new Shelf.Label(4);
        System.out.println(label.text());
    }
}
