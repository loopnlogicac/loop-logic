class Main {
    public static void main(String[] args) {
        Result result = new Result();
        System.out.println(result.setMark(80));
        System.out.println(result.setMark(120));
        System.out.println(result.getMark());
    }
}
class Result {
    private int mark;
    public boolean setMark(int mark) {
        if (mark < 0 || mark > 100) {
            return false;
        }
        this.mark = mark;
        return true;
    }
    public int getMark() {
        return mark;
    }
}
