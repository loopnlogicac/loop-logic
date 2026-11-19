class Main {
    public static void main(String[] args) {
        Result result = new Result(80);
        System.out.println(result.mark);
    }
}
class Result {
    int mark;
    Result(int mark) {
        this.mark = mark;
    }
}
