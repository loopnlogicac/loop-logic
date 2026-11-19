import java.util.List;
import java.util.ArrayList;

record Courses(List<String> names) {
    Courses { names = List.copyOf(names); }
}

class Main {
    public static void main(String[] args) throws Exception {
        List<String> source = new ArrayList<>(List.of("CSE"));
        Courses value = new Courses(source);
        source.add("MAT");
        System.out.println(value.names());
    }
}
