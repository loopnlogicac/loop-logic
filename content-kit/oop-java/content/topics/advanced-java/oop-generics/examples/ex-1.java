class Box<T> {
    private final T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Box<String> room = new Box<>("Lab");
        Box<Integer> seats = new Box<>(30);
        System.out.println(room.get().length());
        System.out.println(seats.get() + 2);
    }
}
