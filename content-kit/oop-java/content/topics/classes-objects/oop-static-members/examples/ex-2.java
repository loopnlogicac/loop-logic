class Main {
    public static void main(String[] args) {
        System.out.println(Settings.limit());
        System.out.println(Settings.limit());
    }
}
class Settings {
    private static int limit;
    static {
        System.out.println("init");
        limit = 30;
    }
    public static int limit() {
        return limit;
    }
}
