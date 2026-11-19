import java.util.Scanner;
interface Notice { String text(); }
class ExamNotice implements Notice {
    @Override
    public String text() { return "Exam"; }
}
class LabNotice implements Notice {
    @Override
    public String text() { return "Lab"; }
}
final class NoticeFactory {
    private NoticeFactory() { }
    static Notice create(int kind) {
        if (kind == 0) { return new ExamNotice(); }
        return new LabNotice();
    }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int kind = input.nextInt();
            int quantity = input.nextInt();
            Notice notice = NoticeFactory.create(kind);
            for (int i = 0; i < quantity; i++) { System.out.println(notice.text()); }
        }
    }
}
