class Library {
    private final String name;
    Library(String name) { this.name = name; }
    class Ticket {
        String label() { return name; }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Library north = new Library("North");
        Library south = new Library("South");
        System.out.println(north.new Ticket().label());
        System.out.println(south.new Ticket().label());
    }
}
