class Main {
    public static void main(String[] args) {
        int[] marks = {45, 60};
        int index = 2;
        if (index >= 0 && index < marks.length) {
            System.out.println(marks[index]);
        } else {
            System.out.println("Invalid index");
        }
    }
}
