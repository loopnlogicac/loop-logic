import java.util.Objects;
class Main {
    public static void main(String[] args) {
        String left = null;
        String right = "Lab";
        System.out.println(Objects.equals(left, right));
        System.out.println(Objects.equals(left, null));
    }
}
