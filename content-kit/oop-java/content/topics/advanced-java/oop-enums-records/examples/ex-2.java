enum DayType { LECTURE, LAB }

class Main {
    public static void main(String[] args) throws Exception {
        DayType type = DayType.LAB;
        int hours = switch (type) {
            case LECTURE -> 1;
            case LAB -> 3;
        };
        System.out.println(hours);
    }
}
