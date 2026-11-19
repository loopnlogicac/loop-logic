interface Left {
    default String name() { return "L"; }
}
interface Right {
    default String name() { return "R"; }
}
class Joint implements Left, Right {
    @Override
    public String name() { return Left.super.name() + Right.super.name(); }
}

class Main {
    public static void main(String[] args) {
        System.out.println(new Joint().name());
    }
}
