class Main {
    public static void main(String[] args) {
        System.out.println(MarkMath.clamp(120));
    }
}
final class MarkMath {
    private MarkMath() {
    }
    static int clamp(int mark) {
        return Math.max(0, Math.min(100, mark));
    }
}
