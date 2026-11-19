import java.util.List;
import java.util.ArrayList;

record Plan(List<String> courses) {
    Plan { courses = List.copyOf(courses); }
}

class Main {
    public static void main(String[] args) throws Exception {
        List<String> source = new ArrayList<>(List.of("CSE"));
        Plan plan = new Plan(source);
        source.add("MAT");
        System.out.println(plan.courses());
    }
}
