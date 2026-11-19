interface Notice {
    default String text() { return "Exam"; }
    static boolean valid(int day) { return day >= 1 && day <= 31; }
}
class ExamNotice implements Notice { }

class Main {
    public static void main(String[] args) {
        Notice notice = new ExamNotice();
        System.out.println(notice.text());
        System.out.println(Notice.valid(7));
    }
}
