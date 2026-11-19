class Main {
    public static void main(String[] args) {
        new Lab();
        new Lab();
    }
}
class Lab {
    static {
        System.out.println("class");
    }
    {
        System.out.println("object");
    }
}
