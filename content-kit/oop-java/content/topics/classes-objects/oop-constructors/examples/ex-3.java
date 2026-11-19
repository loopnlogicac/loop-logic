class Main {
    public static void main(String[] args) {
        new Record();
    }
}
class Record {
    int value = initial();
    {
        System.out.println("block");
    }
    Record() {
        System.out.println("body");
    }
    int initial() {
        System.out.println("field");
        return 1;
    }
}
