class Cell { int value; }

class Main {
    public static void main(String[] args) throws Exception {
        Cell first = new Cell();
        Cell second = first;
        second.value = 8;
        System.out.println(first.value);
    }
}
