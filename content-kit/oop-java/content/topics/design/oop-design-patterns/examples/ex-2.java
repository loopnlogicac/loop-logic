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
        Notice first = NoticeFactory.create(0);
        Notice second = NoticeFactory.create(1);
        System.out.println(first.text());
        System.out.println(second.text());
    }
}
