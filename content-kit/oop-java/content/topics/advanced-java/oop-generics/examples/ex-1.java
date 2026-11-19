class Box<T> {
    private T value;
    void set(T value) { this.value = value; }
    T get() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Box<String> box = new Box<>();
        box.set("CSE");
        System.out.println(box.get().length());
    }
}
