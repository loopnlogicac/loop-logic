class Box<T> {}

class Main {
    public static void main(String[] args) throws Exception {
        Box<String> text = new Box<>();
        Box<Integer> number = new Box<>();
        System.out.println(text.getClass() == number.getClass());
    }
}
